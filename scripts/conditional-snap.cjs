const { execSync } = require('child_process');

// Only run react-snap locally, not on Vercel
if (process.env.VERCEL !== '1') {
  console.log('🔄 Running react-snap...');
  try {
    execSync('react-snap', { stdio: 'inherit' });
  } catch (error) {
    console.error('⚠️  react-snap failed, continuing anyway...');
  }
} else {
  console.log('⏭️  Skipping react-snap on Vercel');
}

// Always generate sitemap
console.log('📄 Generating sitemap...');
require('./generate-sitemap.cjs');