// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { App, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fs from 'fs'; // fsモジュールをインポート
import path from 'path'; // pathモジュールをインポート

// Construct path to service account key relative to project root
// This assumes the service account key is in the project root or a defined path
const serviceAccountKeyFileName = 'serviceAccountKey.json'; // Or your actual file name
const projectRootDir = process.cwd(); // Gets the current working directory (project root)
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
        console.log("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS_JSON_STRING.");
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
        // GOOGLE_APPLICATION_CREDENTIALS is a file path
        firebaseAdminApp = initializeApp({
          credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        }); 
        console.log("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS file path.");
      } else if (fs.existsSync(localServiceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(localServiceAccountPath, 'utf8'));
        firebaseAdminApp = initializeApp({
          credential: cert(serviceAccount),
        });
        console.log(`Firebase Admin SDK initialized using local file: ${localServiceAccountPath}`);
      } else {
        console.warn("Firebase Admin SDK: Service account key not found. Firestore access will fail. Checked env vars and local path: ", localServiceAccountPath);
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

export async function fetchAllBooksFromFirestore(): Promise<any[]> { 
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
    const books: any[] = [];
    snapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() }); 
    });
    // console.log(`Fetched ${books.length} books from Firestore.`); // Reduced verbosity
    return books;
  } catch (error) {
    console.error("Error fetching books from Firestore:", error);
    return []; 
  }
}
