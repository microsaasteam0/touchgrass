# Blog Indexing and Sitemapping Task

## Current Status
- ✅ Analyzed existing blog structure (13 posts in modal format)
- ✅ Identified need for individual URLs for SEO
- ✅ Created comprehensive plan

## Tasks to Complete

### 1. Add Individual Blog Post Routes
- [ ] Update `frontend/src/routes.jsx` to include routes for each blog post
- [ ] Add route pattern `/blog/:slug` for dynamic blog post URLs

### 2. Update Blog Component
- [ ] Modify `frontend/src/pages/Blog.jsx` to handle individual post URLs
- [ ] Add logic to show full post directly when accessed via individual URL
- [ ] Maintain existing modal functionality for blog overview

### 3. Update Sitemap Generator
- [ ] Update `backend/src/utils/sitemapGenerator.js` to include all 13 blog post URLs
- [ ] Ensure proper slugs are generated from post titles

### 4. Regenerate Sitemap
- [ ] Update `frontend/public/sitemap.xml` with individual blog post URLs
- [ ] Verify all posts are included with correct priorities

### 5. Update Robots.txt
- [ ] Update `frontend/public/robots.txt` to allow crawling of blog post URLs
- [ ] Ensure blog posts are not disallowed

### 6. Testing and Verification
- [ ] Test that individual blog post URLs work correctly
- [ ] Verify sitemap.xml includes all posts
- [ ] Check that robots.txt allows blog post crawling
- [ ] Confirm SEO improvements (meta tags, structured data)

## Blog Posts to Index (13 total)
1. why-do-i-feel-tired-even-when-i-dont-do-much
2. what-happens-to-your-body-when-you-stay-indoors-too-much
3. the-hidden-effects-of-not-going-outside-enough
4. why-staying-inside-all-day-makes-you-feel-worse-not-better
5. mental-health-effects-of-spending-too-much-time-indoors
6. is-it-bad-to-stay-inside-all-day-heres-what-actually-happens
7. why-you-feel-lazy-after-being-at-home-all-day
8. how-lack-of-sunlight-affects-your-energy-and-mood
9. the-simplest-health-habit-most-people-are-missing
10. why-going-outside-daily-is-more-important-than-you-think
11. walking-outside-is-the-simplest-fitness-habit-nobody-tracks
12. why-touch-grass-might-be-the-most-honest-health-app
13. new-alternative-to-strava

## Expected Outcomes
- Individual URLs for each blog post (e.g., /blog/post-slug)
- Complete sitemap with all blog posts included
- Improved SEO and search engine indexing
- Better user experience with direct links to posts
