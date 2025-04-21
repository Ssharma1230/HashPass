import React from 'react';
import { useState } from "react";
import { decrypt } from "../security_components/tools/AES_tool"
import {calculatePassword} from '../security_components/components/password_generator';

export default function Site_SignUp() {
      const userId = "testuserid2"
      const userIdEncrypted = "HCxyVsfCvxXKyw/rMRpuTJv99PHUrIZhJHICv4zgkMTHXBtgHJi2"
  
      const [keyString, setKeyString] = useState("");
  
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