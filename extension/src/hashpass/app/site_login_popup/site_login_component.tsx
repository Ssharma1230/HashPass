'use client';
import React from 'react';
import { useState } from "react";
import { decrypt } from "../security_components/tools/AES_tool"

export default function Site_LogIn() {
    const [keyString, setKeyString] = useState("");
    const userId = "test"
    const userIdEncrypted = "9YKLiGuQVMgFlGlvOYcxeeGv2LlmjCF32sAC4iYe59k="

    const handlePassEntry = async () => {
      console.log("Generate password button clicked");
      console.log("Key String: " + keyString);
      console.log("userIdEncrypted: " + userIdEncrypted)

      const decryptedText = await decrypt(userIdEncrypted, keyString);
      console.log("Decrypted Data: " + decryptedText);

      if(decryptedText === userId){
        console.log("Valid Simple passphrase: User Authenticated")
        chrome.runtime.sendMessage({
          action: "fillPassword",
          passphrase: userId
        }, (response) => {
          console.log("Message acknowledged by service worker", response);
        });
      }
      else{
        console.log("Invalid Simple Passphrase")
      }
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