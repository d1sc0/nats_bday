/**
 * Firebase Configuration for Nat's 40th Birthday Video Collection App.
 * 
 * Replace the placeholder values below with your Firebase Project credentials.
 * You can find these credentials in the Firebase Console:
 * Project Settings -> General -> Your apps -> Web app SDK setup
 */
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/**
 * Checks if the Firebase config has been set up with actual credentials.
 */
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("YOUR_")
  );
}
