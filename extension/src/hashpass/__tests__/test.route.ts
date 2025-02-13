import { POST } from '../app/api/hash/route';
import { NextRequest } from 'next/server';
import argon2 from 'argon2';
import { describe, it, expect } from '@jest/globals';

describe('POST function', () => {
  it('should return a hashed value', async () => {
    const requestBody = JSON.stringify({ textToHash: 'test_password' });

    const mockRequest = new NextRequest('http://localhost/api', {
      method: 'POST',
      body: requestBody,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    jest.spyOn(argon2, 'hash').mockResolvedValue('mocked_hash_value');
    
    const response = await POST(mockRequest);
    const json = await response.json();

    expect(argon2.hash).toHaveBeenCalledWith('test_password');
    expect(json).toEqual({ hash: 'mocked_hash_value' });
  });
});
