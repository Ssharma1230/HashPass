'use client';
import { useState } from "react";
import { decrypt } from './tools/AES_tool'

export default function Decryption_Tester() {
    const [keyString, setKeyString] = useState("");
    const [encryptedData, setEncryptedData] = useState("");
    const [decryptedData, setDecryptedData] = useState("");

    const handleDecrypt = () => {
        decrypt(encryptedData, keyString).then(setDecryptedData);
    };
    

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">AES Decryption Tool</h2>

            <label className="block text-sm font-medium text-gray-700">Encrypted Text</label>
            <input
                type="text"
                value={encryptedData}
                onChange={(e) => setEncryptedData(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Enter Encrypted Text"
            />

            <label className="block text-sm font-medium text-gray-700">Encryption Key:</label>
            <input
                type="text"
                value={keyString}
                onChange={(e) => setKeyString(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Enter Encryption Key"
            />

            <button
                onClick={handleDecrypt}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Decrypt Text
            </button>

            {decryptedData && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <p><strong>Decrypted Data:</strong> {decryptedData}</p>
                </div>
            )}

        </div>

        
    );
}