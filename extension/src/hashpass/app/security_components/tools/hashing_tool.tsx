export const hashText = async (text: string): Promise<string> => {
    try {
        const response = await fetch('https://tbkegmgwccq5iiea4tbk5fvmma0tfeya.lambda-url.us-east-1.on.aws/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textToHash: text }),
        });
        const data = await response.json();
        return data.hash || '';
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