/**
 * fetchNews — Cache-first news fetcher.
 *
 * Strategy:
 *  1. Check NewsCache in the database. If a valid (non-expired) cache exists, return it immediately.
 *  2. If cache is missing or expired, call SerpAPI for all 3 regions, deduplicate, store in DB, then return.
 *
 * Cache TTL: 6 hours (articles don't change every minute — no need to hit SerpAPI on every page load).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CACHE_TTL_HOURS = 6;

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1, str2) {
  const costs = [];
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[str2.length] = lastValue;
  }
  return costs[str2.length];
}

async function fetchFreshArticles(SERP_API_KEY) {
  const queries = [
    { q: 'business finance', gl: 'ca', hl: 'en', region: 'Canada' },
    { q: 'business finance', gl: 'us', hl: 'en', region: 'United States' },
    { q: 'business finance', gl: 'cn', hl: 'en', region: 'China' },
  ];

  const allArticles = [];
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query.q)}&gl=${query.gl}&hl=${query.hl}&api_key=${SERP_API_KEY}`
      );
      if (!response.ok) continue;

      const data = await response.json();
      if (data.news_results) {
        const articles = data.news_results.map((article, index) => {
          const publishedDate = article.date ? new Date(article.date) : new Date();
          return {
            id: `${query.region}-${index}-${Date.now()}`,
            title: article.title,
            description: article.snippet || article.title,
            content: article.snippet,
            url: article.link,
            image: article.thumbnail,
            source: article.source?.name || query.region,
            author: article.source?.name,
            publishedAt: publishedDate.toISOString(),
            category: 'Business',
            region: query.region,
            timestamp: publishedDate.getTime(),
          };
        }).filter(article => new Date(article.publishedAt) >= fourWeeksAgo);

        allArticles.push(...articles);
      }
    } catch (err) {
      console.error(`Error fetching news for ${query.region}:`, err.message);
    }
  }

  // Deduplicate by title similarity
  const uniqueArticles = [];
  const seenTitles = new Set();

  for (const article of allArticles) {
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    let isDuplicate = false;
    for (const seenTitle of seenTitles) {
      if (calculateSimilarity(normalizedTitle, seenTitle) > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seenTitles.add(normalizedTitle);
      uniqueArticles.push(article);
    }
  }

  uniqueArticles.sort((a, b) => b.timestamp - a.timestamp);
  return uniqueArticles.slice(0, 100);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const SERP_API_KEY = Deno.env.get('SERP_API');
    if (!SERP_API_KEY) {
      return Response.json({ error: 'SERP API key not configured', articles: [] }, { status: 200 });
    }

    // --- 1. Check cache ---
    const caches = await base44.asServiceRole.entities.NewsCache.list('-created_date', 1);
    const now = new Date();

    if (caches.length > 0) {
      const cached = caches[0];
      const expiresAt = new Date(cached.expires_at);

      if (expiresAt > now && cached.articles?.length > 0) {
        console.log(`Serving ${cached.articles.length} articles from cache (expires ${expiresAt.toISOString()})`);
        return Response.json({
          articles: cached.articles,
          totalResults: cached.articles.length,
          fromCache: true,
          cachedAt: cached.fetched_at,
        });
      }

      console.log('Cache expired, fetching fresh articles...');
    } else {
      console.log('No cache found, fetching fresh articles...');
    }

    // --- 2. Fetch fresh from SerpAPI ---
    const freshArticles = await fetchFreshArticles(SERP_API_KEY);

    if (freshArticles.length === 0) {
      // If SerpAPI returned nothing, serve stale cache rather than empty results
      if (caches.length > 0 && caches[0].articles?.length > 0) {
        console.log('SerpAPI returned 0 results, serving stale cache as fallback.');
        return Response.json({
          articles: caches[0].articles,
          totalResults: caches[0].articles.length,
          fromCache: true,
          stale: true,
        });
      }
      return Response.json({ articles: [], totalResults: 0 });
    }

    // --- 3. Store in cache (delete old entries first) ---
    const fetchedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

    // Delete all old caches
    for (const old of caches) {
      await base44.asServiceRole.entities.NewsCache.delete(old.id);
    }

    await base44.asServiceRole.entities.NewsCache.create({
      articles: freshArticles,
      fetched_at: fetchedAt,
      expires_at: expiresAt,
    });

    console.log(`Fetched and cached ${freshArticles.length} articles until ${expiresAt}`);

    return Response.json({
      articles: freshArticles,
      totalResults: freshArticles.length,
      fromCache: false,
      cachedAt: fetchedAt,
    });

  } catch (error) {
    return Response.json({ error: error.message, articles: [] }, { status: 500 });
  }
});