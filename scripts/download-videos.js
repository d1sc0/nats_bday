import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { firebaseConfig, isFirebaseConfigured } from '../js/firebase-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadAllVideos() {
  console.log('🎉 Starting Video Downloader for Nat\'s 40th Birthday...\n');

  if (!isFirebaseConfigured()) {
    console.error('❌ Firebase credentials are not fully configured in js/firebase-config.js.');
    console.error('   Please add your real Firebase storageBucket and credentials first.\n');
    process.exit(1);
  }

  const bucket = firebaseConfig.storageBucket;
  const targetDir = path.join(process.cwd(), 'downloaded_videos');

  // Create target output directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`📡 Fetching file list from Firebase Storage bucket [${bucket}]...`);
  const listUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=videos/`;

  try {
    const response = await fetch(listUrl);

    if (!response.ok) {
      throw new Error(`Firebase API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      console.log('📂 No videos found in the storage bucket yet.');
      console.log('   Check back once friends start uploading!\n');
      return;
    }

    console.log(`📹 Found ${items.length} video(s) ready for download!\n`);

    let successCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const fullPath = item.name; // e.g. "videos/1723211500_Sarah_clip.mp4"
      const fileName = path.basename(fullPath); // e.g. "1723211500_Sarah_clip.mp4"

      // Skip root folder object if present
      if (!fileName || fullPath === 'videos/') continue;

      const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fullPath)}?alt=media`;
      const outputPath = path.join(targetDir, fileName);

      console.log(`[${i + 1}/${items.length}] Downloading: ${fileName}...`);

      const fileRes = await fetch(mediaUrl);
      if (!fileRes.ok) {
        console.error(`   ⚠️ Failed to download ${fileName}: HTTP ${fileRes.status}`);
        continue;
      }

      const arrayBuffer = await fileRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(outputPath, buffer);

      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ Saved (${sizeMB} MB) -> downloaded_videos/${fileName}\n`);
      successCount++;
    }

    console.log(`🎉 Download Complete! ${successCount} video(s) downloaded to:`);
    console.log(`   📂 ${targetDir}\n`);

  } catch (err) {
    console.error('❌ Error downloading videos:', err.message);
    console.error('   Ensure your Firebase Storage rules allow reading (allow read: if true;).\n');
  }
}

downloadAllVideos();
