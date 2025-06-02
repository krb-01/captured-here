// src/lib/firebaseInit.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported, setConsent, ConsentSettings, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

function initializeFirebaseApp() {
  if (typeof window === "undefined") { 
    return null;
  }
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Failed to initialize Firebase app:", e);
      return null;
    }
  } else {
    app = getApps()[0];
  }
  return app;
}

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!app) {
    return initializeFirebaseApp();
  }
  return app;
};

export const initializeGA = async (): Promise<Analytics | null> => {
  const currentApp = getFirebaseApp();
  if (currentApp && typeof window !== "undefined" && (await isAnalyticsSupported())) {
    if (!analytics) { 
        try {
            analytics = getAnalytics(currentApp);
        } catch(e) {
            console.error("Failed to initialize Google Analytics:", e);
            return null;
        }
    }
    return analytics;
  }
  return null;
};

export function updateAnalyticsConsent(consent: 'accepted' | 'rejected') {
  if (typeof window !== "undefined") { 
    const consentSettings: ConsentSettings = {
      'analytics_storage': consent === 'accepted' ? 'granted' : 'denied',
      'ad_storage': consent === 'accepted' ? 'granted' : 'denied'
    };
    setConsent(consentSettings);
  }
}
