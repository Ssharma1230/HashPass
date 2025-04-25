"use client";

import React, { useEffect, useState } from 'react';
import Site_SignUp from "./site_signup_component"

export default function Site_Signup_Popup() {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        if (tab?.url) {
          setDomain(new URL(tab.url).hostname);
        }
      });
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-xl rounded-2xl text-center">
      <Site_SignUp />
      <div className="font-bold text-lg mt-4 text-gray-700">
        {domain}
      </div>
    </div>
  );
}