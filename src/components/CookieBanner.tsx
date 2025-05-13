
"use client";

import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    // Initialize cookie-dependent services here (e.g., Google Analytics)
    console.log('Cookies accepted');
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    console.log('Cookies rejected');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#212121] text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0 md:mr-4">
          This site uses cookies to enhance user experience and analyze site traffic.
          For more details, please see our <a href="/privacy-policy" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
        <div className="flex gap-x-2">
          <button 
            onClick={handleAccept} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition-colors duration-150"
          >
            Accept
          </button>
          <button 
            onClick={handleReject} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors duration-150"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
