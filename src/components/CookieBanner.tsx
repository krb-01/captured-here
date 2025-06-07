// src/components/CookieBanner.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { initializeGA, updateAnalyticsConsent } from '@/lib/firebaseInit'; // Import GA functions

const COOKIE_CONSENT_KEY = 'cookie_consent_status';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [gaInitialized, setGaInitialized] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consentStatus) { 
      setIsVisible(true);
      updateAnalyticsConsent('rejected');
    } else if (consentStatus === 'accepted') {
      updateAnalyticsConsent('accepted');
      if (!gaInitialized) {
        initializeGA().then(analyticsInstance => {
          if (analyticsInstance) {
            setGaInitialized(true);
          }
        });
      }
    } else { 
      updateAnalyticsConsent('rejected');
    }
  }, [gaInitialized]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    updateAnalyticsConsent('accepted');
    if (!gaInitialized) {
      initializeGA().then(analyticsInstance => {
        if (analyticsInstance) {
          setGaInitialized(true);
        }
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    updateAnalyticsConsent('rejected');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#212121] text-white p-4 shadow-lg z-[100]">
      <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-4 sm:mb-0">
          We use cookies to enhance your experience and for analytics purposes. By clicking &quot;Accept&quot;, you agree to our use of cookies.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
