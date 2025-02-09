'use client';

import React, { useState } from 'react';

export default function MyTestComponent() {
  const [inputValue, setInputValue] = useState('');
  const [hashValue, setHashValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleHash = async () => {
    if (!inputValue) return;

    try {
      const res = await fetch('/api/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToHash: inputValue }),
      });

      const data = await res.json();
      if (data.hash) {
        setHashValue(data.hash);
      } else {
        setHashValue('');
      }
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