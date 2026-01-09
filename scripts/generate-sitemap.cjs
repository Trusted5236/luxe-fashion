const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/products', changefreq: 'daily', priority: 0.9 },
  { url: '/cart', changefreq: 'weekly', priority: 0.7 },
  { url: '/auth', changefreq: 'monthly', priority: 0.6 },
  { url: '/forgot-password', changefreq: 'monthly', priority: 0.5 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/faq', changefreq: 'monthly', priority: 0.6 },
  { url: '/shipping', changefreq: 'monthly', priority: 0.6 },
  { url: '/size-guide', changefreq: 'monthly', priority: 0.6 },
  { url: '/track', changefreq: 'monthly', priority: 0.6 },
  { url: '/sustainability', changefreq: 'monthly', priority: 0.6 },
  { url: '/careers', changefreq: 'monthly', priority: 0.6 },
  { url: '/press', changefreq: 'monthly', priority: 0.6 },
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ 
    hostname: 'https://luxe-fashion-three.vercel.app' 
  });

  const writeStream = createWriteStream(resolve(__dirname, '../dist/sitemap.xml'));
  
  sitemap.pipe(writeStream);

  links.forEach(link => sitemap.write(link));
  
  sitemap.end();

  await streamToPromise(sitemap);
  
  console.log('✅ Sitemap generated successfully at dist/sitemap.xml');
}

generateSitemap().catch(console.error);