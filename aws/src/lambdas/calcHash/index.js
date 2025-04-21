"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2 = require('argon2');
const handler = async (event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization'
            },
            body: ''
        };
    }
    try {
        const raw = event.body;

        // Parse JSON if input is a JSON object or read raw text
        let textToHash;
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.textToHash === 'string') {
                textToHash = parsed.textToHash;
            } else {
                textToHash = typeof parsed === 'string' ? parsed : raw;
            }
        } catch {
            textToHash = raw;
        }

        console.log("Data to Hash: ", textToHash);
        const slt = Buffer.from('my-static-salt', 'utf8');
        const hashValue = await argon2.hash(textToHash, {
            salt: slt,
            type: argon2.argon2id,
            timeCost: 2, // Number of iterations.
            memoryCost: 65536, // Memory in KiB.
            hashLength: 32, // Length of the resulting hash.
            parallelism: 1,
        });
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization'
            },
            body: JSON.stringify({ hash: hashValue }),
        };
    }
    catch (error) {
        console.error('Hashing error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization'
            },
            body: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
        };
    }
};
module.exports = { handler };