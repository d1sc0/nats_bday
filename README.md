# 🎂 Nat's 40th Birthday - Video Message Collector

A mobile-first web app designed to collect video messages from 40 friends for Nat's surprise milestone 40th birthday video edit. Built with vanilla HTML, modern CSS, JavaScript, and powered by Firebase Storage & Firebase Hosting.

---

## 🌟 Key Features

- **📱 Mobile-First Design**: Optimized for smartphones so friends can record directly from their camera in portrait mode or choose a clip from their camera roll.
- **☀️ Warm Light Theme**: Elegant champagne-toned light design with subtle pastel background aura and high-contrast readable typography.
- **⚡ Streamlined Form**: Clean form requiring only the sender's name and video file upload.
- **📹 Live Video Preview & Meta Info**: Instantly previews recorded clips and displays filename/size before submitting.
- **📊 Progress Bar & Confetti**: Displays live upload percentage and triggers a festive confetti celebration upon completion.
- **✉️ Built-in Support Link**: Help link for guests encountering any issues (`mail@hellostu.xyz`).
- **📥 1-Command Video Downloader Script**: Download all 40 uploaded videos to your local machine with `npm run download`.

---

## 🚀 Quick Start & Local Development

### 1. Run Dev Server Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production

```bash
npm run build
```

---

## 📥 Downloading Uploaded Videos (1-Command Automation)

When friends upload their videos, you can download all video clips directly to your local computer in one command:

```bash
npm run download
```

This script will:
- Connect to your Firebase Storage bucket (`nat-day.firebasestorage.app`).
- Fetch all video files inside the `videos/` folder.
- Save each video clip locally into [`./downloaded_videos/`](file:///Users/d1sc0/Projects/nats_birthday/downloaded_videos).

*(Alternatively, you can manually view and download videos via the [Firebase Storage Console](https://console.firebase.google.com/) under **Build** -> **Storage** -> **Files** -> `videos/`)*.

---

## 📦 Deployment Guide

### Deploying to Firebase Hosting

```bash
# 1. Login to Firebase CLI
npx firebase login

# 2. Select your Firebase project
npx firebase use nat-day

# 3. Build and deploy
npm run build
npx firebase deploy
```

Your web app will be live at `https://nat-day.web.app` or `https://nat-day.firebaseapp.com`!

### GitHub Actions Auto-Deployment

The repository includes a GitHub Action workflow ([`.github/workflows/firebase-hosting.yml`](file:///Users/d1sc0/Projects/nats_birthday/.github/workflows/firebase-hosting.yml)) that automatically builds and deploys the site whenever code is pushed to `main`.

---

## 🔒 Firebase Storage Security Rules

The storage rules in [`storage.rules`](file:///Users/d1sc0/Projects/nats_birthday/storage.rules) allow guests to upload video files up to 500MB without needing an account:

```cel
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{allPaths=**} {
      allow write: if request.resource.size < 500 * 1024 * 1024
                   && request.resource.contentType.matches('video/.*');
      allow read: if true;
    }
  }
}
```

---

## 💻 Tech Stack

- **Frontend**: Vanilla HTML5, Custom Light CSS Theme (Glassmorphism & Pastel Aura), JavaScript (ES Modules)
- **Bundler / Dev Server**: Vite
- **Storage & Hosting**: Firebase Storage & Firebase Hosting
- **Automation**: Node.js Video Downloader CLI script (`scripts/download-videos.js`)
- **CI/CD**: GitHub Actions
