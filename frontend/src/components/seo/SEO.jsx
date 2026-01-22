import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SEO = ({
  title = 'TouchGrass - Daily Accountability Platform',
  description = 'Build unbreakable habits with psychology-backed streak systems. Join thousands building discipline through daily outdoor accountability.',
  canonical = '',
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  children,
  schema = null,
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://touchgrass.now';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  return (
    <HelmetProvider>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullCanonical} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:url" content={fullCanonical} />
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="TouchGrass" />
        
        {/* Twitter */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
        
        {/* Robots */}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
        
        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* JSON-LD Schema */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
        
        {/* Additional children meta tags */}
        {children}
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;