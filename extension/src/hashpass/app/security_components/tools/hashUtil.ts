import { hash } from 'argon2-browser';

export const hashTextLocal = async (text: string): Promise<string> => {
  try {
    const hashObj = await hash({
      pass: text,
      salt: 'my-static-salt',
      type: 2,
      time: 2,
      mem: 65536, // Memory in KiB.
      hashLen: 32,
      parallelism: 1,
    });
    return hashObj.encoded;
  } catch (error) {
    console.error('Hashing error:', error);
    return '';
  }
};