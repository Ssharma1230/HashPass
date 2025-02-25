import { hashText, extractHash } from "./hashing_tool";

async function importKey(keyString: string): Promise<CryptoKey> {
    try {
        const hashedKeyString = await hashText(keyString);
        const extractedKeyStringHash = extractHash(hashedKeyString);

        const keyBytes = new Uint8Array(extractedKeyStringHash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))); // Assuming hex encoding

        // Ensure key length is 16 or 32 bytes for AES
        if (keyBytes.length !== 16 && keyBytes.length !== 32) {
            throw new Error("Invalid key length! Must be 16 or 32 bytes.");
        }

        return await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    } catch (error) {
        console.error("Error importing key:", error);

        // Default key: Use a fallback 32-byte key (AES-256)
        const defaultKeyBytes = new Uint8Array(32).fill(0); // All zeros (change if needed)

        return await crypto.subtle.importKey(
            "raw",
            defaultKeyBytes,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    }
}

export async function encrypt(userId: string, keyString: string) : Promise<string> {
    if (!userId || !keyString) {
        return "";
    }

    const encoder = new TextEncoder();
    const key = await importKey(keyString);
    const ivArray = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivArray },
        key,
        encoder.encode(userId)
    );

    const initialization_vector =  btoa(String.fromCharCode(...ivArray));
    const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))
    const finalEncString = initialization_vector + encryptedData

    return finalEncString;
}

export async function decrypt(encryptedData: string, keyString: string) : Promise<string> {
    if (!encryptedData || !keyString) {
        return "";
    }

    const iv = encryptedData.slice(0, 16);
    const rawEncryptedData = encryptedData.slice(16, encryptedData.length)

    const decoder = new TextDecoder();
    const key = await importKey(keyString);
    const ivArray = new Uint8Array(atob(iv).split("").map(char => char.charCodeAt(0)));
    const encryptedBytes = new Uint8Array(atob(rawEncryptedData).split("").map(char => char.charCodeAt(0)));

    console.log("Encrypted Data: "+rawEncryptedData);
    console.log("Key String: "+keyString);
    console.log("IV: "+iv);

    try {
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivArray },
            key,
            encryptedBytes
        );
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error("Decryption failed! Invalid key or corrupted data.",error);
        return "";
    }
}