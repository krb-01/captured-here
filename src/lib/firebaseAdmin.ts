// src/lib/firebaseAdmin.ts
// import admin from 'firebase-admin'; // Removed
import { App, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore, Timestamp as AdminTimestamp } from 'firebase-admin/firestore'; // Imported AdminTimestamp
import fs from 'fs';
import path from 'path';

// Firestore data structure interface (should ideally be shared or kept in sync with page.tsx)
interface FirestoreBookData {
  id?: string; // Document ID, added when processing snapshot
  author: string;
  country: string; // Comma-separated string
  created_at: AdminTimestamp | string | Date; // Firestore Admin SDK Timestamp or string/Date for flexibility
  description: string;
  image_url?: string;
  region: string; // Comma-separated string
  title: string;
  updated_at: AdminTimestamp | string | Date; // Firestore Admin SDK Timestamp or string/Date
  url: string; // Amazon URL
  // isbn is not directly in Firestore based on current understanding
}

const serviceAccountKeyFileName = 'serviceAccountKey.json';
const projectRootDir = process.cwd();
const localServiceAccountPath = path.join(projectRootDir, serviceAccountKeyFileName);

let firebaseAdminApp: App | null = null;
let db: Firestore | null = null;

function initializeFirebaseAdminApp() {
  if (getApps().length === 0) { 
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_STRING) {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_STRING);
        firebaseAdminApp = initializeApp({
          credential: cert(serviceAccount),
        });
        // console.log("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS_JSON_STRING.");
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
        firebaseAdminApp = initializeApp({
          credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        }); 
        // console.log("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS file path.");
      } else if (fs.existsSync(localServiceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(localServiceAccountPath, 'utf8'));
        firebaseAdminApp = initializeApp({
          credential: cert(serviceAccount),
        });
        // console.log(`Firebase Admin SDK initialized using local file: ${localServiceAccountPath}`);
      } else if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.GOOGLE_CLOUD_PROJECT) {
        firebaseAdminApp = initializeApp();
        // console.log("Firebase Admin SDK initialized using default credentials (emulator or GCP environment).");
      } else {
        console.warn(`Firebase Admin SDK: Service account key could not be found. Firestore access will likely fail.`);
        return null;
      }
    } catch (error) {
      console.error("Firebase Admin SDK initialization error:", error);
      return null;
    }
  } else {
    firebaseAdminApp = getApps()[0];
  }
  return firebaseAdminApp;
}

export const getDb = (): Firestore | null => {
  if (!db) {
    const appInstance = initializeFirebaseAdminApp();
    if (appInstance) {
      db = getFirestore(appInstance);
    }
  }
  return db;
};

export async function fetchAllBooksFromFirestore(): Promise<FirestoreBookData[]> { 
  const firestoreDb = getDb();
  if (!firestoreDb) {
    console.error("Firestore instance is not available for fetchAllBooksFromFirestore.");
    return []; 
  }

  try {
    const booksCollection = firestoreDb.collection('books');
    const snapshot = await booksCollection.get();
    if (snapshot.empty) {
      console.log('No matching documents in books collection.');
      return [];
    }
    const books: FirestoreBookData[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as Omit<FirestoreBookData, 'id'>;
      books.push({
        id: doc.id,
        ...data
      } as FirestoreBookData);
    });
    return books;
  } catch (error) {
    console.error("Error fetching books from Firestore:", error);
    return []; 
  }
}
