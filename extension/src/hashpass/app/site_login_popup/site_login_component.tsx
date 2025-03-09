'use client';
import React from 'react';
import { useState } from "react";
import {decrypt} from "../security_components/tools/AES_tool"

export default function Site_LogIn() {
    const userId = "testuserid" // This value will be the user's id in plaintext (retrieved from DB)
    const userIdEncrypted = "RN5Oag4zBlVIwNS1NBCatXezzn3t/aLR8mn28t2sE/TBp0hpYtU=" // This value will be the user's id in ciphertext (retrieved from DB)

    //valid simple pass for testing is 1234
    const [keyString, setKeyString] = useState("");
    const [decryptedData, setDecryptedData] = useState("");

    const handleSimplePassAuth = async () => {
        const decryptedText = await decrypt(userIdEncrypted, keyString);
        setDecryptedData(decryptedText)

        console.log(decryptedData);

        if(decryptedData === userId){
          console.log("Valid Simple passphrase: User Authenticated")
        }
        else{
          console.log("Invalid Simple Passphrase")
        }
    };


    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">Enter Simple Passphrase to log-in to site</h2>
            <label className="block text-sm font-medium text-gray-700">Simple Passphrase:</label>
            <input
                type="text"
                value={keyString}
                onChange={(e) => setKeyString(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Enter Simple Passphrase"
            />

            <button
                onClick={handleSimplePassAuth}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Encrypt User ID
            </button>

            
        </div>
    );
}