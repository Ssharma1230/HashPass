import React from 'react';
import { useState } from "react";
import { decrypt } from "../security_components/tools/AES_tool"
import {calculatePassword} from '../security_components/components/password_generator';
import { parse } from "tldts";

export default function Site_SignUp() {
  const UUID = "f98699a0-d010-4a68-833e-fc9cbbcdf800"
  const userIdEncrypted = "W3CeGzefGlIYyBS5RjiZnFmBI0RdTc8EJDQmwLM1LyUw3zTfGa6botvDVJvE2JlMM5/P8FZOjPRPC7TXJ/B02A=="
  // valid simple pass for testing is Passpass@1

  const [keyString, setKeyString] = useState("");

  const handlePassEntry = async () => {
    console.log("Generate password button clicked");
    console.log("Key String: " + keyString);
    console.log("userIdEncrypted: " + userIdEncrypted)

    const decryptedText = await decrypt(userIdEncrypted, keyString);
    console.log("Decrypted Data: " + decryptedText);

    if(decryptedText === UUID){
      console.log("Valid Simple passphrase: User Authenticated")

      const domain = parse(window.location.href).domain ?? "";
      console.log("Parsed Domain:", domain);
      try {
        const response = await fetch("https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/insertDomainName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            UUID,
            domain
          })
        });
        if (!response.ok) {
          throw new Error("Failed to add domain to DB");
        }
        const result = await response.json();
        console.log("Domain successfully added:", result);
      } catch (err) {
        console.error("Error adding domain:", err);
      }

      const password = await calculatePassword(keyString, domain, userIdEncrypted);
      console.log("Password String: ", password)

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
        Sign Up with HashPass
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
        Generate Password to Sign Up
      </button>
    </div>
  ); 
}