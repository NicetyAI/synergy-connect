import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const SERP_API_KEY = Deno.env.get("SERP_API");
    
    if (!SERP_API_KEY) {
      return Response.json({ 
        error: 'SERP API key not configured',
        articles: []
      }, { status: 200 });
    }

    // Fetch business and finance news from Canada, US, and China
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
          }).filter(article => {
            // Only include articles from last 4 weeks
            const articleDate = new Date(article.publishedAt);
            return articleDate >= fourWeeksAgo;
          });
          
          allArticles.push(...articles);
        }
      } catch (error) {
        console.error(`Error fetching news for ${query.region}:`, error);
      }
    }

    // Remove duplicates based on title similarity
    const uniqueArticles = [];
    const seenTitles = new Set();
    
    for (const article of allArticles) {
      // Normalize title by removing punctuation and extra spaces
      const normalizedTitle = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Check if similar title already exists
      let isDuplicate = false;
      for (const seenTitle of seenTitles) {
        const similarity = calculateSimilarity(normalizedTitle, seenTitle);
        if (similarity > 0.8) { // 80% similarity threshold
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        seenTitles.add(normalizedTitle);
        uniqueArticles.push(article);
      }
    }

    // Helper function to calculate string similarity
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

    // Sort by latest first
    uniqueArticles.sort((a, b) => b.timestamp - a.timestamp);

    return Response.json({ 
      articles: uniqueArticles.slice(0, 100),
      totalResults: uniqueArticles.length
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      articles: []
    }, { status: 500 });
  }
});