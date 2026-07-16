#!/usr/bin/env node
/**
 * Cloudinary onboarding verification script
 * Runs: configure -> upload demo image -> fetch metadata -> build transformed URL
 */
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary (inline credentials)
cloudinary.config({
  cloud_name: 'fe2afxou',
  api_key: '662237992985318',
  api_secret: 'UFe49op2xNgrqQD-TX6ZvYd9-7c',
});

async function main() {
  // 2. Upload a sample image from Cloudinary's demo domain
  const uploadResult = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    { public_id: 'onboarding_sample' }
  );
  console.log('Uploaded!');
  console.log('  Secure URL:', uploadResult.secure_url);
  console.log('  Public ID :', uploadResult.public_id);

  // 3. Fetch and print metadata about the uploaded image
  const details = await cloudinary.api.resource(uploadResult.public_id);
  console.log('Image details:');
  console.log('  Width :', details.width);
  console.log('  Height:', details.height);
  console.log('  Format:', details.format);
  console.log('  Size  :', details.bytes, 'bytes');

  // 4. Transformed URL:
  //    f_auto — Cloudinary picks the best format for the requesting browser (e.g. AVIF/WebP instead of JPG)
  //    q_auto — Cloudinary picks the optimal compression quality automatically (smaller file, same visual quality)
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    fetch_format: 'auto', // f_auto
    quality: 'auto',      // q_auto
    secure: true,
  });
  console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
  console.log(transformedUrl);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
