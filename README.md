# 🎂 Nat's 40th Birthday - Video Message Collector

A mobile-first web app designed to collect video messages from friends for Nat's 40th birthday celebration. Built with vanilla HTML, modern CSS, JavaScript, and powered by Firebase Storage & Firebase Hosting.

---

## 🌟 Key Features

- **📱 Mobile-First Design**: Optimized for smartphones so friends can record directly from their mobile camera or choose a clip from their camera roll.
- **🎥 Video Preview & Meta Info**: Instantly previews recorded clips and displays filename/size before uploading.
- **📊 Real-time Progress Bar**: Displays live upload progress with percentage updates.
- **🥳 Celebration Feedback**: Displays a festive success screen with confetti animation upon upload completion.
- **🔒 Secure Storage**: Saves video clips with sender names and notes attached directly in your Firebase Storage bucket.

---

## 🚀 Quick Setup Guide

### 1. Create a Free Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Create a project**.
2. Name your project (e.g., `nats-40th-birthday`).
3. Click **Continue** (you can disable Google Analytics if you don't need it) and click **Create project**.

### 2. Enable Firebase Storage

1. In your Firebase project sidebar, click **Build** -> **Storage** -> **Get started**.
2. Start in **Production mode** (or Test mode) and select your storage bucket location.
3. Once Storage is initialized, go to the **Rules** tab and paste the following rules (also saved in `storage.rules` in this repo):

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

4. Click **Publish**.

### 3. Add Web App & Copy Configuration Keys

1. In your Firebase Project Overview page, click the **Web (`</>`)** icon to register a web app.
2. Enter an App nickname (e.g., `NatsBirthdayWeb`). Also check the option **"Also set up Firebase Hosting"**.
3. Copy your `firebaseConfig` object and paste it into [`js/firebase-config.js`](file:///Users/d1sc0/Projects/nats_birthday/js/firebase-config.js):

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🛠️ Testing Locally

You can preview and test the site locally:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. *(Note: If Firebase credentials aren't set yet, the app runs in demo mode so you can preview the design).*

---

## 📦 Deploying to Firebase Hosting

### Option A: Direct Deployment via Terminal

1. Install Firebase CLI globally (or run via `npx`):
   ```bash
   npx firebase login
   ```
2. Link your project ID:
   ```bash
   npx firebase use YOUR_PROJECT_ID
   ```
3. Build & Deploy:
   ```bash
   npm run build
   npx firebase deploy
   ```
4. Your site will be live at `https://YOUR_PROJECT_ID.web.app`! 🎉

### Option B: Automatic Deployment via GitHub Actions

1. Push your repository to GitHub:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/nats-40th-birthday.git
   git branch -M main
   git push -u origin main
   ```
2. Generate a Firebase Service Account Key:
   ```bash
   npx firebase init hosting:github
   ```
3. Follow the prompts to add the `FIREBASE_SERVICE_ACCOUNT` secret to your GitHub Repository settings. Every push to `main` will now automatically deploy your latest site to Firebase Hosting!

---

## 📥 How to Access & Download Uploaded Videos

When your friends upload their videos, they are automatically organized inside your Firebase Storage bucket under the `videos/` folder:

1. Open your [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Build** -> **Storage** -> **Files**.
3. Open the `videos/` directory.
4. Each file is named with timestamp and sender name (e.g. `1723211500_Sarah_video.mp4`).
5. Select files and click **Download** to save them directly to your computer for video editing!

---

## 💻 Tech Stack

- **Frontend**: Vanilla HTML5, Modern CSS (Glassmorphism, Ambient Glows, Mobile-First), JavaScript (ES Modules)
- **Tooling**: Vite (Dev Server & Bundler)
- **Backend/Storage**: Firebase Storage & Firebase Hosting
- **CI/CD**: GitHub Actions
