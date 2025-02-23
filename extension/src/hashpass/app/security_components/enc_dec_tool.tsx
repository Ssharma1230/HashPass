'use client';
import { useState } from "react";

export default function EncDecTool() {
    const [userId, setUserId] = useState("");
    const [keyString, setKeyString] = useState("");
    const [encryptedData, setEncryptedData] = useState("");
    const [iv, setIv] = useState("");
    const [decryptedUserId, setDecryptedUserId] = useState("");

    const hashText = async (text: string): Promise<string> => {
        try {
            const res = await fetch('/api/hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ textToHash: text }),
            });
    
            const data = await res.json();
            return data.hash || ''; // Return hash if available, otherwise return an empty string
        } catch (error) {
            console.error('Hash error:', error);
            return ''; // Return empty string in case of an error
        }
    };
    
    const extractHash = (input: string): string => {
        const parts = input.split('$'); // Split the string by '$'
    
        if (parts.length > 3) {
            return parts.slice(4).join('$'); // Join everything after the 3rd '$'
        }
    
        return ''; // Return empty string if there are not enough '$' symbols
    };

    async function importKey(keyString: string): Promise<CryptoKey> {
        //const encoder = new TextEncoder();
        //const keyBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(keyString)); // Hash the key to 32 bytes
        const hashedKeyString = await hashText(keyString);
        const extractedKeyStringHash = extractHash(hashedKeyString)
    
        const keyBytes = new Uint8Array(extractedKeyStringHash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))); // Assuming hex encoding

        // Ensure key length is 16 or 32 bytes for AES
        if (keyBytes.length !== 16 && keyBytes.length !== 32) {
            throw new Error("Invalid key length! Must be 16 or 32 bytes.");
        }

        return await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
        
    }
    

    async function encryptUserId() {
        if (!userId || !keyString) {
            alert("Please enter both a User ID and a Key.");
            return;
        }

        const encoder = new TextEncoder();
        const key = await importKey(keyString);
        const ivArray = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: ivArray },
            key,
            encoder.encode(userId)
        );

        setIv(btoa(String.fromCharCode(...ivArray))); // Store IV as base64
        setEncryptedData(btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))); // Store encrypted data as base64
        setDecryptedUserId(""); // Reset decrypted text

        alert("User ID Encrypted Successfully!");
    }

    async function decryptUserId() {
        if (!encryptedData || !iv || !keyString) {
            alert("Missing encrypted data, IV, or key.");
            return;
        }

        const decoder = new TextDecoder();
        const key = await importKey(keyString);
        const ivArray = new Uint8Array(atob(iv).split("").map(char => char.charCodeAt(0)));
        const encryptedBytes = new Uint8Array(atob(encryptedData).split("").map(char => char.charCodeAt(0)));

        try {
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: ivArray },
                key,
                encryptedBytes
            );
            setDecryptedUserId(decoder.decode(decryptedBuffer));
        } catch (error) {
            alert("Decryption failed! Invalid key or corrupted data.");
            console.error('Hash error:', error);
            setDecryptedUserId("");
        }
    }

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
                onClick={encryptUserId}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Encrypt User ID
            </button>

            {encryptedData && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <p><strong>Encrypted Data:</strong> {encryptedData}</p>
                    <p><strong>IV:</strong> {iv}</p>
                </div>
            )}

            <button
                onClick={decryptUserId}
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