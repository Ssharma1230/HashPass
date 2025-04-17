'use client';
import React from 'react';
import { useState } from "react";

export default function Site_LogIn() {
    const [keyString, setKeyString] = useState("");

    const handlePassEntry = async () => {
      console.log("Generate password button clicked");
      console.log("Key String: " + keyString);
    
      chrome.runtime.sendMessage({
        action: "fillPassword",
        passphrase: keyString
      }, (response) => {
        console.log("Message acknowledged by service worker", response);
      });
    };
    
    
      return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4">Enter Simple Passphrase to log in to site</h2>
          <label className="block text-sm font-medium text-gray-700">Simple Passphrase:</label>
          <input
            type="text"
            value={keyString}
            onChange={(e) => setKeyString(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
            placeholder="Enter Simple Passphrase"
          />
    
          <button
            onClick={handlePassEntry}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Generate Password
          </button>
        </div>
      );
}