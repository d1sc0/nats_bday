/**
 * Firebase Configuration for Nat's 40th Birthday Video Collection App.
 *
 * Replace the placeholder values below with your Firebase Project credentials.
 * You can find these credentials in the Firebase Console:
 * Project Settings -> General -> Your apps -> Web app SDK setup
 */
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCaAST8kBFDl0Uh9gBwUcFFggGfkfWz9V4',
  authDomain: 'nat-day.firebaseapp.com',
  projectId: 'nat-day',
  storageBucket: 'nat-day.firebasestorage.app',
  messagingSenderId: '760275841933',
  appId: '1:760275841933:web:52d19d9810edad322b43c4',
};

/**
 * Checks if the Firebase config has been set up with actual credentials.
 */
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('YOUR_') &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('YOUR_')
  );
}
