'use client';

import React, { useState } from 'react';
//import { CalculateSalts } from './salt_calculator';
//import { hashText, extractHash } from '../tools/hashing_tool';


/*const securityAnswers: string[] = [
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
];*/


export const calculatePassword = async (salt: string): Promise<string> => {
    try {
        const response = await fetch('https://a5yz9onkp8.execute-api.us-east-1.amazonaws.com/default/gen_password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({           
            salt: salt,       
          }),
        });
        const data = await response.json();
        return data.hash || '';
      } catch (error) {
        console.error('Hash error:', error);
        return ''; // Return empty string in case of an error.
      }
}


export default function PasswordGenerator() {
    

    const [inputValue, setInputValue] = useState('');
    const [strong_password, setStrongPasswordText] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    };

    const handleGeneratePassword = async () => {
        
        const strongPassword = await calculatePassword(inputValue);
        setStrongPasswordText(strongPassword);

    
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