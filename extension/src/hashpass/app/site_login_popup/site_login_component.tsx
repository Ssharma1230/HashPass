'use client';
import React, { useState } from 'react';
import { decrypt } from "../security_components/tools/AES_tool";
import { calculatePassword } from '../security_components/components/password_generator';

export default function Site_LogIn() {
    const userId = "testuserid"; // This value will be the user's id in plaintext (retrieved from DB)
    const userIdEncrypted = "8gb2BSJbvxtRs53WGHs6jBoVBztcA03gIFv8t8Bm/CLt6fGKkEY="; // This value will be the user's id in ciphertext (retrieved from DB)

    const [keyString, setKeyString] = useState("");
    const [loading, setLoading] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState(""); // State to store the generated password
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handlePassEntry = async () => {
        setLoading(true);
        setSpinnerMessage('Generating Password...');

        try {
            const decryptedText = await decrypt(userIdEncrypted, keyString);
            if (decryptedText === userId) {
                const password = await calculatePassword(keyString, "test", "test");
                setGeneratedPassword(password);
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

    return (
        <div className="w-[350px] mt-4 p-6 bg-white shadow-2xl rounded-2xl relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Log In with HashPass
            </h2>

            {/* Conditionally render based on loading state or password generation */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="spinner"></div>
                    <p className="ml-2">{spinnerMessage}</p>
                </div>
            ) : generatedPassword ? (
                <div className="text-center">
                    <p className="text-gray-800 mb-4 font-semibold">Password Entered</p>
                    
                    {/* Password Display */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={showPassword ? generatedPassword : '•••••••••••••••••••••••••••'}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        />
                    </div>

                    {/* Show / Hide password button */}
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
                        Generate Password & Login
                    </button>
                </div>
            )}
        </div>
    );
}