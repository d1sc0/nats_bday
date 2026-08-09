import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

// Firebase SDK ESM Imports from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

// DOM Elements
const formCard = document.getElementById('formCard');
const videoForm = document.getElementById('videoForm');
const senderNameInput = document.getElementById('senderName');
const birthdayNoteInput = document.getElementById('birthdayNote');
const videoInput = document.getElementById('videoInput');
const dropzone = document.getElementById('dropzone');
const dropzoneContent = document.getElementById('dropzoneContent');

const previewContainer = document.getElementById('previewContainer');
const videoPreview = document.getElementById('videoPreview');
const btnChangeVideo = document.getElementById('btnChangeVideo');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const fileSizeDisplay = document.getElementById('fileSizeDisplay');

const errorBanner = document.getElementById('errorBanner');
const errorText = document.getElementById('errorText');

const progressContainer = document.getElementById('progressContainer');
const progressStatus = document.getElementById('progressStatus');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');

const btnSubmit = document.getElementById('btnSubmit');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');

const successCard = document.getElementById('successCard');
const btnUploadAnother = document.getElementById('btnUploadAnother');
const configNotice = document.getElementById('configNotice');

// State
let selectedFile = null;
let storage = null;

// Initialize Firebase if credentials are provided
if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    console.log('Firebase Storage initialized successfully.');
  } catch (err) {
    console.error('Firebase initialization error:', err);
    showConfigNotice();
  }
} else {
  showConfigNotice();
}

function showConfigNotice() {
  if (configNotice) {
    configNotice.classList.remove('hidden');
  }
}

// Drag & Drop events on dropzone
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('dragover');
  });
});

dropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files && files.length > 0) {
    handleFileSelected(files[0]);
  }
});

// File input selection event
videoInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFileSelected(e.target.files[0]);
  }
});

// Handle video file preview and validation
function handleFileSelected(file) {
  hideError();

  // Basic validation: Check if file type is video
  if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|avi|m4v|3gp)$/i)) {
    showError('Please select a valid video file (e.g. MP4, MOV, WEBM).');
    return;
  }

  selectedFile = file;

  // Format file size
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  fileNameDisplay.textContent = file.name;
  fileSizeDisplay.textContent = `${sizeMB} MB`;

  // Create preview URL
  const objectUrl = URL.createObjectURL(file);
  videoPreview.src = objectUrl;

  // Show preview container & hide dropzone
  dropzone.classList.add('hidden');
  previewContainer.classList.remove('hidden');
}

// Change video button
btnChangeVideo.addEventListener('click', () => {
  resetVideoSelection();
  videoInput.click();
});

function resetVideoSelection() {
  selectedFile = null;
  videoInput.value = '';
  if (videoPreview.src) {
    URL.revokeObjectURL(videoPreview.src);
    videoPreview.src = '';
  }
  previewContainer.classList.add('hidden');
  dropzone.classList.remove('hidden');
}

// Form submission handler
videoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  if (!selectedFile) {
    showError('Please select or record a video first.');
    return;
  }

  const senderName = senderNameInput.value.trim();
  if (!senderName) {
    showError('Please enter your name.');
    return;
  }

  const birthdayNote = birthdayNoteInput.value.trim();

  // If Firebase is not configured, run demo upload simulation
  if (!isFirebaseConfigured() || !storage) {
    simulateDemoUpload(senderName);
    return;
  }

  // Real Firebase Storage Upload
  try {
    setSubmittingState(true);
    progressContainer.classList.remove('hidden');

    // Clean filename and path
    const sanitizedName = senderName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `videos/${timestamp}_${sanitizedName}_${cleanFileName}`;
    
    const storageRef = ref(storage, storagePath);

    // Custom metadata attached to storage file
    const metadata = {
      contentType: selectedFile.type || 'video/mp4',
      customMetadata: {
        senderName: senderName,
        birthdayNote: birthdayNote || '',
        uploadDate: new Date().toISOString()
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const rounded = Math.round(progress);
        progressBar.style.width = `${rounded}%`;
        progressPercent.textContent = `${rounded}%`;
        progressStatus.textContent = rounded < 100 ? 'Uploading video...' : 'Finalizing...';
      },
      (error) => {
        console.error('Upload failed:', error);
        setSubmittingState(false);
        progressContainer.classList.add('hidden');
        showError(`Upload failed: ${error.message || 'Please try again.'}`);
      },
      () => {
        // Upload finished successfully
        setSubmittingState(false);
        triggerSuccessState();
      }
    );

  } catch (err) {
    console.error('Error initiating upload:', err);
    setSubmittingState(false);
    progressContainer.classList.add('hidden');
    showError('An error occurred starting the upload. Please try again.');
  }
});

// Demo upload simulation for offline/preview mode
function simulateDemoUpload(senderName) {
  setSubmittingState(true);
  progressContainer.classList.remove('hidden');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;
    progressPercent.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        setSubmittingState(false);
        triggerSuccessState();
      }, 400);
    }
  }, 250);
}

// Success handler & celebration
function triggerSuccessState() {
  formCard.classList.add('hidden');
  successCard.classList.remove('hidden');

  // Trigger confetti effect if available
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Reset form for uploading another video
btnUploadAnother.addEventListener('click', () => {
  videoForm.reset();
  resetVideoSelection();
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressContainer.classList.add('hidden');
  successCard.classList.add('hidden');
  formCard.classList.remove('hidden');
});

// UI Helper functions
function setSubmittingState(isSubmitting) {
  btnSubmit.disabled = isSubmitting;
  if (isSubmitting) {
    btnText.textContent = 'Uploading...';
    btnSpinner.classList.remove('hidden');
  } else {
    btnText.textContent = 'Upload Video Message 🚀';
    btnSpinner.classList.add('hidden');
  }
}

function showError(msg) {
  errorText.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function hideError() {
  errorBanner.classList.add('hidden');
}
