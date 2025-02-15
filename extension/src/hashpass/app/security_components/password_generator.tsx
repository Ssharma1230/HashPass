'use client';

import React, { useState } from 'react';
import { CalculateSalts } from './salt_calculator';


const securityAnswers: string[] = [
    "Fluffy", // Answer to: "What was the name of your first pet?"
    "Maple Street", // Answer to: "What street did you grow up on?"
    "Blue", // Answer to: "What is your favorite color?"
    "Toyota Corolla", // Answer to: "What was your first car?"
    "Mrs. Thompson", // Answer to: "Who was your favorite teacher?"
    "Pizza", // Answer to: "What is your favorite food?"
    "1985", // Answer to: "What year was your father born?"
    "Hawaii", // Answer to: "Where did you go on your honeymoon?"
    "Superman", // Answer to: "Who is your childhood hero?"
    "Beethoven", // Answer to: "What is your favorite composer or musician?"
];


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

        const salt_indicies = await CalculateSalts(inputValue); // For now input value will go into calculating salt indicies for testing. Will change to an internal value

        /*const salt1 = await hashText(securityAnswers[salt_indicies[0]])
        const salt2 = await hashText(securityAnswers[salt_indicies[1]])
        const salt3 = await hashText(securityAnswers[salt_indicies[2]])*/
        const salt1 = securityAnswers[salt_indicies[0]];
        const salt2 = securityAnswers[salt_indicies[1]];
        const salt3 = securityAnswers[salt_indicies[2]];

        console.log(salt_indicies)

        var arranged_string = hashed_name+salt2+hashed_phone+salt1+hashed_domain+salt3+hashed_email;
        const fullHash = await hashText(arranged_string)
        const extractedHash = extractHash(fullHash);
        console.log(fullHash)
        console.log(extractedHash)

        setStrongPasswordText(extractedHash);

    
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
        {strong_password && <p>Strong Password: {strong_password}</p>}
    </div>
);
}