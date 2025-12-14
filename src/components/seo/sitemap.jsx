// Generate XML sitemap for the application
export const generateSitemap = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentDate = new Date().toISOString();
  
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Home
    { url: 'Partnerships', priority: '0.9', changefreq: 'daily' },
    { url: 'Opportunities', priority: '0.9', changefreq: 'daily' },
    { url: 'Vendors', priority: '0.8', changefreq: 'weekly' },
    { url: 'Events', priority: '0.8', changefreq: 'daily' },
    { url: 'Forum', priority: '0.8', changefreq: 'daily' },
    { url: 'News', priority: '0.7', changefreq: 'daily' },
    { url: 'ActivityFeed', priority: '0.6', changefreq: 'hourly' },
    { url: 'Recommendations', priority: '0.6', changefreq: 'daily' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Download sitemap as XML file
export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Get robots.txt content
export const getRobotsTxt = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  return `User-agent: *
Allow: /
Disallow: /Admin
Disallow: /Settings

Sitemap: ${baseUrl}/sitemap.xml`;
};