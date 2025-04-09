'use client';

import React, { useState } from 'react';
import { hashText, extractHash } from "../../security_components/tools/hashing_tool";

export default function MyTestComponent() {
  const [inputValue, setInputValue] = useState('');
  const [hashValue, setHashValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleHash = async () => {
    if (!inputValue) return;

    try {
      const returnedVal = await hashText(inputValue);
      const extractedHashVal = extractHash(returnedVal);

      /*const data = await res.json();
      if (data.hash) {
        setHashValue(data.hash);
      } else {
        setHashValue('');
      }*/
     setHashValue(extractedHashVal)
    } catch (error) {
      console.error('Hash error:', error);
    }
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

      <button onClick={handleHash}>Hash</button>

      <p>Current value: {inputValue}</p>
      {hashValue && <p>Argon2 hash: {hashValue}</p>}
    </div>
  );
}