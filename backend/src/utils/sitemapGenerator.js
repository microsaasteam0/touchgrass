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
      // Core - Homepage (exists)
      { url: '/', changefreq: 'daily', priority: 1.0 },

      // Existing Public Pages (verified to exist)
      { url: '/leaderboard', changefreq: 'hourly', priority: 0.9 },
      { url: '/challenges', changefreq: 'daily', priority: 0.8 },
      { url: '/subscription', changefreq: 'weekly', priority: 0.8 },

      // Authority & AEO Layer - Blog page exists
      { url: '/blog', changefreq: 'weekly', priority: 0.9 },

      // Blog Content Pages (Authority content) - All exist in Blog.jsx
      { url: '/blog/why-do-i-feel-tired-even-when-i-dont-do-much', changefreq: 'yearly', priority: 0.8 },
      { url: '/blog/what-happens-to-your-body-when-you-stay-indoors-too-much', changefreq: 'yearly', priority: 0.8 },
      { url: '/blog/the-hidden-effects-of-not-going-outside-enough', changefreq: 'yearly', priority: 0.8 },
      { url: '/blog/why-staying-inside-all-day-makes-you-feel-worse-not-better', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/mental-health-effects-of-spending-too-much-time-indoors', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/is-it-bad-to-stay-inside-all-day-heres-what-actually-happens', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/why-you-feel-lazy-after-being-at-home-all-day', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/how-lack-of-sunlight-affects-your-energy-and-mood', changefreq: 'yearly', priority: 0.8 },
      { url: '/blog/the-simplest-health-habit-most-people-are-missing', changefreq: 'yearly', priority: 0.8 },
      { url: '/blog/why-going-outside-daily-is-more-important-than-you-think', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/walking-outside-is-the-simplest-fitness-habit-nobody-tracks', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/why-touch-grass-might-be-the-most-honest-health-app', changefreq: 'yearly', priority: 0.7 },
      { url: '/blog/new-alternative-to-strava', changefreq: 'yearly', priority: 0.7 },
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
