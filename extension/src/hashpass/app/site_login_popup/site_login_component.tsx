'use client';
import React from 'react';
import { useState } from "react";
import { decrypt } from "../security_components/tools/AES_tool"
import {calculatePassword} from '../security_components/components/password_generator';

export default function Site_LogIn() {
    const userId = "testuserid2" // This value will be the user's id in plaintext (retrieved from DB)
    const userIdEncrypted = "HCxyVsfCvxXKyw/rMRpuTJv99PHUrIZhJHICv4zgkMTHXBtgHJi2" // This value will be the user's id in ciphertext (retrieved from DB)
    //valid simple pass for testing is testkey

    const [keyString, setKeyString] = useState("");
    //const [decryptedData, setDecryptedData] = useState("");

    const handlePassEntry = async () => {
      console.log("Generate password button clicked");
      console.log("Key String: " + keyString);
      console.log("userIdEncrypted: " + userIdEncrypted)

      const decryptedText = await decrypt(userIdEncrypted, keyString);
      console.log("Decrypted Data: " + decryptedText);

      if(decryptedText === userId){
        console.log("Valid Simple passphrase: User Authenticated")
        const password = await calculatePassword(keyString);
        console.log("Password String: ",password)

        chrome.runtime.sendMessage({
          action: "fillPassword",
          passphrase: password
        }, (response) => {
          console.log("Message acknowledged by service worker", response);
        });
      }
      else{
        console.log("Invalid Simple Passphrase")
      }
    };
    
    
    return (
      <div className="w-[350px] mt-4 p-6 bg-white shadow-2xl rounded-2xl relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Log In with HashPass
        </h2>
    
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Enter your passphrase:
          </label>
          <input
            type="text"
            value={keyString}
            onChange={(e) => setKeyString(e.target.value)}
            placeholder="Simple Passphrase"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          />
        </div>
    
        <button
          onClick={handlePassEntry}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition duration-300"
        >
          Generate Password & Login
        </button>
      </div>
    );    
}