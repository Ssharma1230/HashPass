'use client';

import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';

const securityQuestions = [
  "What is your favorite color?",
  "What is your mother's maiden name?",
  "What was the make and model of your first car?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What was the name of your childhood best friend?",
  "What is the title of your favorite book?",
  "What is the name of your favorite teacher?",
  "What is your favorite food?",
  "What is the name of the street you grew up on?",
];

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    securityAnswers: Array(10).fill(''),
    passphrase: '',
    confirmPassphrase: '',
  });
  
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return; // Ensure only numeric input for phone
    setFormData({ ...formData, [name]: value });
  };

  const handleSecurityAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.securityAnswers];
    newAnswers[index] = value;
    setFormData({ ...formData, securityAnswers: newAnswers });
  };

  const validatePassphrase = (passphrase: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passphrase);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.passphrase !== formData.confirmPassphrase) {
      setError('Passphrases do not match.');
      return;
    }
    if (!validatePassphrase(formData.passphrase)) {
      setError('Passphrase must be at least 8 characters long and include at least one letter, one number, and one special character.');
      return;
    }
    
    try {
      const res = await fetch('/api/user-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign-up failed');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }    
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card sx={{ width: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            {securityQuestions.map((question, index) => (
              <TextField
                key={index}
                fullWidth
                margin="normal"
                label={question}
                value={formData.securityAnswers[index]}
                onChange={(e) => handleSecurityAnswerChange(index, e.target.value)}
                required
              />
            ))}
            <TextField fullWidth margin="normal" label="Passphrase" name="passphrase" type="password" value={formData.passphrase} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Confirm Passphrase" name="confirmPassphrase" type="password" value={formData.confirmPassphrase} onChange={handleChange} required />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button fullWidth variant="contained" type="submit" sx={{ marginTop: 2 }}>Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

