import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

class FirebaseService {
  private db: any;
  private static instance: FirebaseService;

  private constructor() {
    try {
      // Initialize Firebase with configuration from environment variables
      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  // Singleton pattern to ensure only one instance of Firebase service
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Save data to Firestore
  async saveSubmission(id: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, 'submissions', id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error('Error saving submission to Firestore:', error);
      throw error;
    }
  }

  // Get submission by ID
  async getSubmission(id: string): Promise<any> {
    try {
      const docRef = doc(this.db, 'submissions', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting submission from Firestore:', error);
      throw error;
    }
  }
}

export default FirebaseService; 