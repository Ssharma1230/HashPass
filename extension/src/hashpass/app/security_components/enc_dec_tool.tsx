'use client';
import { useState } from "react";
import { encrypt, decrypt } from './tools/AES_tool'

export default function Encryption_Tester() {
    const [userId, setUserId] = useState("");
    const [keyString, setKeyString] = useState("");
    const [encryptedData, setEncryptedData] = useState("");
    const [decryptedUserId, setDecryptedUserId] = useState("");

    const handleEncrypt = () => {
        encrypt(userId, keyString).then(setEncryptedData);
    };

    const handleDecrypt = () => {
        decrypt(encryptedData, keyString).then(setDecryptedUserId);
    };
    

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">AES Encryption Vault</h2>

            <label className="block text-sm font-medium text-gray-700">User ID:</label>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Enter User ID"
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

            <button
                onClick={handleDecrypt}
                className="w-full mt-3 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
                Decrypt User ID
            </button>

            {decryptedUserId && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <p><strong>Decrypted User ID:</strong> {decryptedUserId}</p>
                </div>
            )}
        </div>

        
    );
}