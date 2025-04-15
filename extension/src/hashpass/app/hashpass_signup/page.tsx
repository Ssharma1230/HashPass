'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

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
  const router = useRouter();
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
    const passphraseRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,}$/;
    return passphraseRegex.test(passphrase);
  };

  const [loading, setLoading] = useState(false); // Track loading state

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true); // Start loading animation

  if (formData.passphrase !== formData.confirmPassphrase) {
    setError('Passphrases do not match.');
    setLoading(false);
    return;
  }
  if (!validatePassphrase(formData.passphrase)) {
    setError('Passphrase must be at least 12 characters long which include at least one uppercase letter, one number, and one special character.');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch('/api/user-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Sign-up failed');
    }

    router.push('/login'); // Redirect to login page after successful signup
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  } finally {
    setLoading(false); // Stop loading animation
  }
};

  
  
  return (
    <Box className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 450, padding: 4, boxShadow: 5, borderRadius: 3, bgcolor: 'white' }}>
        <CardContent>
          <Typography variant="h4" textAlign="center" gutterBottom color="primary">
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
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading} // Disable button while loading
              sx={{ marginTop: 3, bgcolor: 'primary.main', color: 'white', fontSize: 16, padding: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
