import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyDfqhgnnB0hVHZO_ewOoSpzYsEmKjLwWiQ',
  authDomain: 'e-commerce-angular-dba51.firebaseapp.com',
  projectId: 'e-commerce-angular-dba51',
  storageBucket: 'e-commerce-angular-dba51.firebasestorage.app',
  messagingSenderId: '256436374136',
  appId: '1:256436374136:web:57264fb2c6d816eb2a3b8d',
  measurementId: 'G-9SFMPWRFJD'
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);