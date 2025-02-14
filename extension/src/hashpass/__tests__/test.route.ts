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

    const actualCall = (argon2.hash as jest.Mock).mock.calls[0][1];

    if (Buffer.isBuffer(actualCall.salt)) {
      actualCall.salt = { data: Array.from(actualCall.salt), type: 'Buffer' };
    }

    expect(actualCall).toEqual({
      memoryCost: 65536,
      parallelism: 1,
      salt: { data: [109, 121, 45, 115, 116, 97, 116, 105, 99, 45, 115, 97, 108, 116], type: 'Buffer' },
      timeCost: 2,
      type: 2,
    });

    expect(json).toEqual({ hash: 'mocked_hash_value' });
  });
});
