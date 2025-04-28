'use client';
import React, { useState } from 'react';
import { decrypt } from "../security_components/tools/AES_tool";
import { calculatePassword } from '../security_components/components/password_generator';
import { parse } from "tldts";
import { getEncryptedUuid } from '../site_login_popup/site_login_component';

export default function Site_SignUp() {
    const UUID = "randomuuid";

    const [keyString, setKeyString] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState(""); // Store generated password
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [spinnerMessage, setSpinnerMessage] = useState('');
    const [blockSuccessMessage, setBlockSuccessMessage] = useState<string>('');


    const handlePassEntry = async () => {
        setLoading(true);
        setSpinnerMessage('Generating Password...');
        
        try {
            const userIdEncrypted = await getEncryptedUuid(UUID);
            const decryptedText = await decrypt(userIdEncrypted, keyString);
            if (decryptedText === UUID) {
                console.log("Valid Simple passphrase: User Authenticated");
                
                const domain = parse(window.location.href).domain ?? "";
                console.log("Parsed Domain:", domain);

                try {
                    const response = await fetch("https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/insertDomainName", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ UUID, domain })
                    });

                    if (response.status === 401) {
                      console.log("Duplicate entry detected, launching login popup...");
                      chrome.runtime.sendMessage({ action: "detected_login_form" });
                      return;
                    }
                    if (!response.ok) {
                        throw new Error("Failed to add domain to DB");
                    }
                    const result = await response.json();
                    console.log("Domain successfully added:", result);
                } catch (err) {
                    console.error("Error adding domain:", err);
                }

                // Generate password after success
                const password = await calculatePassword(keyString, domain, userIdEncrypted);
                setGeneratedPassword(password);
                chrome.runtime.sendMessage({
                  action: "fillPassword",
                  passphrase: password
                }, (response) => {
                  console.log("Message acknowledged by service worker", response);
                });
            } else {
                console.log("Invalid Simple Passphrase");
            }
        } catch (error) {
            console.error("Error during password handling:", error);
        } finally {
            setLoading(false);
            setSpinnerMessage('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword)
            .then(() => alert("Password copied to clipboard!"))
            .catch((error) => alert("Failed to copy password: " + error));
    };

    const blockWebsite = async () => {
      setLoading(true);
      setSpinnerMessage("Blocking website...");
    
      try {
        const userIdEncrypted = await getEncryptedUuid(UUID);
        const decryptedText = await decrypt(userIdEncrypted, keyString);
    
        if (decryptedText === UUID) {
          console.log("Valid Simple passphrase: User Authenticated");
    
          const domain = parse(window.location.href).domain ?? "";
          console.log("Parsed Domain:", domain);
    
          const response = await fetch("https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/insertBlockedDomain", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uuid: UUID, domain }),
          });
    
          if (!response.ok) {
            if (response.status === 401) {
              setBlockSuccessMessage(`This website is already blocked.`);
            } else {
              throw new Error("Failed to block website");
            }
          } else {
            const result = await response.json();
            console.log("Website successfully blocked:", result);
            setBlockSuccessMessage(`Successfully blocked ${domain}`);
          }
        }
      } catch (err) {
        console.error("Error blocking website:", err);
        if (!blockSuccessMessage) {
          setBlockSuccessMessage("Failed to block website. Please try again.");
        }
      } finally {
        setLoading(false);
        setSpinnerMessage("");
      }
    };    

    return (
      <div className="w-[350px] min-h-[600px] mt-4 p-6 bg-white shadow-2xl rounded-2xl relative flex flex-col justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up with HashPass
        </h2>
    
        {/* Conditionally render the content */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner"></div>
            <p className="ml-2">{spinnerMessage}</p>
          </div>
        ) : blockSuccessMessage ? (
          <div className="text-center">
            <p className="text-gray-800 mb-4 font-semibold">{blockSuccessMessage}</p>
          </div>
        ) : generatedPassword ? (
          <div className="text-center">
            <p className="text-gray-800 mb-4 font-semibold">Password Generated</p>
    
            {/* Password Display */}
            <div className="mb-4">
              <input
                type="text"
                value={showPassword ? generatedPassword : '•••••••••••••••••••••••••••'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
            </div>
    
            {/* Show/Hide password button */}
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300 mb-4"
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
    
            {/* Copy to clipboard button */}
            <button
              onClick={copyToClipboard}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition duration-300"
            >
              Copy to Clipboard
            </button>
          </div>
        ) : (
          <div>
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
            {/* Block Website Button */}
            <button
              onClick={blockWebsite}
              style={{ outline: '2px solid red', background: 'red', color: 'white' }}
              className="w-full py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300 mt-4"
            >
              Block This Website
            </button>
          </div>
        )}
      </div>
    );    
}