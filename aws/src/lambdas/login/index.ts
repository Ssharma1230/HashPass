
import { APIGatewayEvent } from "aws-lambda";
import { serialize } from 'cookie';

interface SessionOptions {
    name?: string;
    value: string;
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
}

const handler = async (event: APIGatewayEvent) => {
    // Parse body information
    const requestBody = JSON.parse(event.body || "{}");
    const email = requestBody.email;
    const password = requestBody.password;

    // Query database for uuid and encrypted uuid
    const uuid = await getIDFromDatabase(email);
    const encrypted_uuid = await getEncryptedIDFromDatabase(email);
    const iv = await getIVFromDatabase(email);
    
    // Decrypt encryped uuid and compare with uuid
    const decoder = new TextDecoder();
    const ivArray = new Uint8Array(atob(iv).split("").map(char => char.charCodeAt(0)));
    const encryptedBytes = new Uint8Array(atob(encrypted_uuid).split("").map(char => char.charCodeAt(0)));

    try {
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivArray },
            password,
            encryptedBytes
        );
        const decrypted = decoder.decode(decryptedBuffer);
        if (decrypted !== uuid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" })
            };
        }
    } catch (error) {
        console.error('Hash error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Unsuccessful while decrypting ID" })
        }
    }

    // Create session cookie
    const sessionCookie = createSessionCookie({ value: uuid });
    console.log(`Session cookie: ${sessionCookie}`);

    return {
        statusCode: 200,
        headers: {
          'Set-Cookie': sessionCookie,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Session created' })
    };
}; 

export function createSessionCookie({
  name = 'session',
  value,
  maxAge = 60 * 60, // 1 hour session
  secure = true,
  httpOnly = true,
  path = '/',
  sameSite = 'strict',
}: SessionOptions): string {
  return serialize(name, value, {
    maxAge,
    secure,
    httpOnly,
    path,
    sameSite,
  });
}

const getIDFromDatabase = async (email: string) => {
    console.log(`Getting IDs for email: ${email}`);
    return "uuid";
}

const getEncryptedIDFromDatabase = async (email: string) => {
    console.log(`Getting encrypted IDs for email: ${email}`);
    return "encrypted_uuid";
}

const getIVFromDatabase = async (email: string) => {
    console.log(`Getting IV for email: ${email}`);
    return "iv";
}

module.exports = { handler };