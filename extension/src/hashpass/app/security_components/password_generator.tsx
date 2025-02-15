'use client';

import React, { useState } from 'react';

export const hashText = async (text: string): Promise<string> => {
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

export const extractHash = (input: string): string => {
    const parts = input.split('$'); // Split the string by '$'

    if (parts.length > 3) {
        return parts.slice(4).join('$'); // Join everything after the 3rd '$'
    }

    return ''; // Return empty string if there are not enough '$' symbols
};

export default function PasswordGenerator() {
    const enc_name = "Name";
    const enc_email = "name@gmail.com"
    const enc_phone = "5555555555"
    const site_domain = "amazon.com"

    const [inputValue, setInputValue] = useState('');
    const [strong_password, setStrongPasswordText] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    };

    const handleGeneratePassword = async () => {
        if (!inputValue) return;
            
        const hashed_name = await hashText(enc_name);
        const hashed_email = await hashText(enc_email);
        const hashed_phone = await hashText(enc_phone);
        const hashed_domain = await hashText(enc_phone);

        var arranged_string = hashed_name+hashed_phone+hashed_domain+hashed_email;
        const fullHash = await hashText(arranged_string)
        const extractedHash = extractHash(fullHash);
        console.log(fullHash)
        console.log(extractedHash)

        setStrongPasswordText(extractedHash);
        console.log(strong_password)

    
    };

    return (
    <div style={{ padding: '1rem' }}>
        <label htmlFor="my-input">Enter something:</label>
        <input
        id="my-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        style={{ marginLeft: '0.5rem' }}
        />

        <button onClick={handleGeneratePassword}>Generate Strong Password</button>

        <p>Current value: {inputValue}</p>
        {strong_password && <p>Argon2 hash: {strong_password}</p>}
    </div>
);
}