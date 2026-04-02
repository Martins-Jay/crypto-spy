import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCKK5Ev_bAN-wAajAgTe4Cbh3tDKHzBU5c',
  authDomain: 'cryptospy-mod.firebaseapp.com',
  projectId: 'cryptospy-mod',
  storageBucket: 'cryptospy-mod.firebasestorage.app',
  messagingSenderId: '468282817449',
  appId: '1:468282817449:web:e739a32581a30debba62b8',
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
};
