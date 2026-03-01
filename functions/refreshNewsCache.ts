/**
 * refreshNewsCache — Scheduled job to proactively refresh the news cache.
 * Run this every 6 hours via an automation so that users ALWAYS get cached data instantly.
 * This is an admin-only / scheduled endpoint.
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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const SERP_API_KEY = Deno.env.get('SERP_API');
    if (!SERP_API_KEY) {
      return Response.json({ error: 'SERP API key not configured' }, { status: 500 });
    }

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

    if (allArticles.length === 0) {
      return Response.json({ error: 'No articles fetched from SerpAPI', count: 0 }, { status: 500 });
    }

    // Deduplicate
    const uniqueArticles = [];
    const seenTitles = new Set();
    for (const article of allArticles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      let isDuplicate = false;
      for (const seenTitle of seenTitles) {
        if (calculateSimilarity(normalizedTitle, seenTitle) > 0.8) { isDuplicate = true; break; }
      }
      if (!isDuplicate) { seenTitles.add(normalizedTitle); uniqueArticles.push(article); }
    }
    uniqueArticles.sort((a, b) => b.timestamp - a.timestamp);
    const finalArticles = uniqueArticles.slice(0, 100);

    const now = new Date();
    const fetchedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

    // Delete old caches
    const oldCaches = await base44.asServiceRole.entities.NewsCache.list('-created_date', 10);
    for (const old of oldCaches) {
      await base44.asServiceRole.entities.NewsCache.delete(old.id);
    }

    await base44.asServiceRole.entities.NewsCache.create({
      articles: finalArticles,
      fetched_at: fetchedAt,
      expires_at: expiresAt,
    });

    return Response.json({ success: true, count: finalArticles.length, cachedUntil: expiresAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});