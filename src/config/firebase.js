import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAatglbeknAo9ypVs_aR46cFYhi5q4g2Ik",
  authDomain: "mywebsite-9288a.firebaseapp.com",
  projectId: "mywebsite-9288a",
  storageBucket: "mywebsite-9288a.appspot.com",
  messagingSenderId: "1072238108568",
  appId: "1:1072238108568:web:edb5c3a9a2af41a3e7d5ed",
  measurementId: "G-KBDJBXZ4E7"
};

console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized:', app);

console.log('Getting auth...');
const auth = getAuth();
console.log('Auth initialized:', auth);

const db = getFirestore();
const storage = getStorage();

export { app, auth, db, storage };