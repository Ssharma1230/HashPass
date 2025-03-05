'use client';
import { useState } from "react";
import {encrypt} from "../security_components/tools/AES_tool"

export default function Site_LogIn() {
    const userId = "testuserid"
    const [keyString, setKeyString] = useState("");
    const [encryptedData, setEncryptedData] = useState("");

    const handleEncrypt = () => {
        encrypt(userId, keyString).then(setEncryptedData);
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
                onClick={handleEncrypt}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Encrypt User ID
            </button>

            {encryptedData && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <p><strong>Encrypted Data:</strong> {encryptedData}</p>
                </div>
            )}
        </div>
    );
}