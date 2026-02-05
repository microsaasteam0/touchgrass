import React from 'react';
 
  const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { format } = require('date-fns');

class SitemapGenerator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.pages = [];
  }

  addPage(url, changefreq = 'daily', priority = 0.7, lastmod = null) {
    this.pages.push({
      url,
      changefreq,
      priority,
      lastmod: lastmod || format(new Date(), 'yyyy-MM-dd')
    });
  }

  async generate() {
    const links = [
      // Static pages
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/leaderboard', changefreq: 'hourly', priority: 0.9 },
      { url: '/subscription', changefreq: 'weekly', priority: 0.8 },
      { url: '/challenges', changefreq: 'daily', priority: 0.8 },
      { url: '/chat', changefreq: 'daily', priority: 0.7 },
      { url: '/shame-wall', changefreq: 'hourly', priority: 0.8 },
      
      // Dynamic pages (example structure)
      { url: '/blog', changefreq: 'weekly', priority: 0.6 },
      { url: '/blog/psychology-of-habits', changefreq: 'monthly', priority: 0.5 },
      { url: '/blog/streak-science', changefreq: 'monthly', priority: 0.5 },
      { url: '/blog/social-accountability', changefreq: 'monthly', priority: 0.5 },
      
      // Legal pages
      { url: '/privacy', changefreq: 'monthly', priority: 0.3 },
      { url: '/terms', changefreq: 'monthly', priority: 0.3 },
      { url: '/contact', changefreq: 'monthly', priority: 0.4 },
    ];

    // Add user pages if available (would come from database in production)
    const stream = new SitemapStream({ hostname: this.baseUrl });
    
    const xml = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then(data => data.toString());

    return xml;
  }

  async generateStatic() {
    const staticPages = [
      { url: '/', priority: 1.0 },
      { url: '/leaderboard', priority: 0.9 },
      { url: '/subscription', priority: 0.8 },
      { url: '/challenges', priority: 0.8 },
      { url: '/chat', priority: 0.7 },
      { url: '/shame-wall', priority: 0.8 },
      { url: '/privacy', priority: 0.3 },
      { url: '/terms', priority: 0.3 },
      { url: '/contact', priority: 0.4 },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${this.baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  }
}

module.exports = SitemapGenerator;