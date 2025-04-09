import { hashTextLocal } from './hashUtil';

export const hashText = async (text: string): Promise<string> => {
    try {
        // Directly use the local hashing function instead of making a fetch call.
        const hash = await hashTextLocal(text);
        return hash;
    } catch (error) {
        console.error('Hash error:', error);
        return ''; // Return empty string in case of an error.
    }
};

export const extractHash = (input: string): string => {
    const parts = input.split('$'); // Split the string by '$'

    if (parts.length > 3) {
        return parts.slice(4).join('$'); // Join everything after the 3rd '$'
    }

    return ''; // Return empty string if there are not enough '$' symbols
};