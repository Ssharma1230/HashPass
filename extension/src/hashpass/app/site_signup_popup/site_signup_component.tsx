import React from 'react';
import { useState } from "react";
import { decrypt } from "../security_components/tools/AES_tool"
import {calculatePassword} from '../security_components/components/password_generator';
import { parse } from "tldts";

export default function Site_SignUp() {
      const UUID = "f98699a0-d010-4a68-833e-fc9cbbcdf800"
      const userIdEncrypted = "DSvanR4myji5VmzC06OutTH+nsVUbcOc0pqP7iLPgePsrNj5obsMXkZd+yI9m6MRzf/Xeq921dzq73rvTi/zEQ=="
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

          const domain = parse(window.location.href).domain;
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

          const password = await calculatePassword(keyString);
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
        <div className="w-64 p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-4">Click the button to generate password for site</p>
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
            Generate Password to Login
          </button>
        </div>
      );
}