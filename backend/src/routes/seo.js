const express = require('express');
const router = express.Router();
const SitemapGenerator = require('../utils/sitemapGenerator');

// Sitemap route
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const generator = new SitemapGenerator(baseUrl);
    const sitemap = await generator.generate();
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Static sitemap
router.get('/sitemap-static.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const generator = new SitemapGenerator(baseUrl);
    const sitemap = await generator.generateStatic();
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Static sitemap error:', error);
    res.status(500).send('Error generating static sitemap');
  }
});

// Robots.txt route (optional - can also serve from public folder)
router.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /profile
Disallow: /api/
Sitemap: ${process.env.FRONTEND_URL || 'https://touchgrass.entrext.in'}/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

module.exports = router;