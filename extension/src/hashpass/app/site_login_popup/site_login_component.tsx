"use client";
import React, { useEffect, useState } from 'react';
import { decrypt } from "../security_components/tools/AES_tool";
import { calculatePassword } from '../security_components/components/password_generator';
import { parse } from "tldts";

export async function getEncryptedUuid(uuid: string): Promise<string> {
  const API_URL = "https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/getUserInfo";

  try {
    const response = await fetch(API_URL, {
      method: "POST", // or GET if your endpoint supports it
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UUID: uuid }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Expecting an array of rows: [{ enc_uuid, enc_email, ... }, …]
    const rows: Array<{ enc_uuid: string }> = await response.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("No user found for the given UUID");
    }

    return rows[0].enc_uuid;
  } catch (err) {
    console.error("getEncryptedUuid error:", err);
    throw err;
  }
}

export default function Site_LogIn() {
    // This value will be the user's id in plaintext (retrieved from cache)
    //const userIdEncrypted = "8gb2BSJbvxtRs53WGHs6jBoVBztcA03gIFv8t8Bm/CLt6fGKkEY="; // This value will be the user's id in ciphertext (retrieved from DB)
    

    const [keyString, setKeyString] = useState("");
    const [loading, setLoading] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState(""); // State to store the generated password
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [blockSuccessMessage, setBlockSuccessMessage] = useState<string>('');

    const [userId, setUserId] = useState("");
        
    useEffect(() => {
        async function fetchUUID(): Promise<string>{
            return new Promise((resolve) => {
                chrome.storage.sync.get(["uuid"], (result) => {
                    const userId = result.uuid || "";
                    resolve(userId);
                });
            });
        }
        
        // Set the UUID from storage
        fetchUUID().then((fetchedUuid) => {
            setUserId(fetchedUuid);
        });
    }, []);

    const handlePassEntry = async () => {
        setLoading(true);
        setSpinnerMessage('Generating Password...');
        console.log("UUID: ", userId);

        try {
            const userIdEncrypted = await getEncryptedUuid(userId);
            console.log("User ID encrypted: ",userIdEncrypted);
            const domain = parse(window.location.href).domain ?? "";
            const decryptedText = await decrypt(userIdEncrypted, keyString);
            if (decryptedText === userId) {
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
          const userIdEncrypted = await getEncryptedUuid(userId);
          const decryptedText = await decrypt(userIdEncrypted, keyString);

          if (decryptedText === userId) {
              console.log("Valid Simple Passphrase: User Authenticated");

              const domain = parse(window.location.href).domain ?? "";
              console.log("Parsed Domain:", domain);

              const response = await fetch("https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/insertBlockedDomain", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ uuid: userId, domain }),
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
          } else {
              console.log("Invalid Simple Passphrase");
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
              Log In with HashPass
          </h2>

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
                  <p className="text-gray-800 mb-4 font-semibold">Password Entered</p>

                  <div className="mb-4">
                      <input
                          type="text"
                          value={showPassword ? generatedPassword : '•••••••••••••••••••••••••••'}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                      />
                  </div>

                  <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-300 mb-4"
                  >
                      {showPassword ? 'Hide Password' : 'Show Password'}
                  </button>

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
                      Generate Password & Login
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