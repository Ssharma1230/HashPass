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
    <div className="w-64 p-4 bg-white shadow-lg rounded-lg text-center">
      <Site_SignUp/>
      <div style={{ fontWeight: 'bold', marginTop: '8px' }}>
        {domain}
      </div>
    </div>
  );
}