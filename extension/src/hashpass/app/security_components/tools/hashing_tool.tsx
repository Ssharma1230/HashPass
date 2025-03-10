export const hashText = async (text: string): Promise<string> => {
    try {
        //const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await fetch('http://localhost:3000/api/hash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToHash: text }),
        });

        const data = await res.json();
        return data.hash || ''; // Return hash if available, otherwise return an empty string
    } catch (error) {
        console.error('Hash error:', error);
        return ''; // Return empty string in case of an error
    }
};

export const extractHash = (input: string): string => {
    const parts = input.split('$'); // Split the string by '$'

    if (parts.length > 3) {
        return parts.slice(4).join('$'); // Join everything after the 3rd '$'
    }

    return ''; // Return empty string if there are not enough '$' symbols
};