import argon2 from 'argon2';

// Async function to hash text
export async function hashText(text:string, argon2_salt:string) {
    try {
        const dataToHash = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
        const slt = Buffer.from(argon2_salt, 'utf8');
        const hashValue = await argon2.hash(dataToHash, {
            salt: slt,
            type: argon2.argon2id,
            timeCost: 2, // Number of iterations.
            memoryCost: 65536, // Memory in KiB.
            hashLength: 32, // Length of the resulting hash.
            parallelism: 1,
        });
        console.log("Hash Value: ",hashValue);
        return {
            statusCode: 200,
            body: JSON.stringify({ hash: hashValue }),
        };
    }
    catch (error) {
        console.error('Hashing error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
        };
    }
}

// Extract hash
export const extractHash = (input:string) => {
    console.log("extractHash input: ", input)
    const parts = input.split('$'); 
    return parts.length > 3 ? parts.slice(4).join('$') : '';
};