"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const promise_1 = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};
const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null));
    let httpMethod;
    try {
        httpMethod = event.requestContext.http.method;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("APIGatewayEvent");
        }
        httpMethod = event.httpMethod;
    }
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
    let request_body;
    if (event.body) {
        request_body = JSON.parse(event.body);
    }
    else {
        console.log("No body found");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "No body found" }),
        };
    }
    const { UUID, domain } = request_body;
    console.log(UUID, domain);
    try {
        const connection = await (0, promise_1.createConnection)(dbConfig);
        const [rows] = await connection.execute('SELECT 1 FROM users WHERE uuid = ? LIMIT 1', [UUID]);
        const uuidExists = rows.length > 0;
        if (!uuidExists) {
            await connection.end();
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "UUID does not exist" }),
            };
        }
        try {
            const [result] = await connection.execute('INSERT INTO user_websites (uuid, domain_id) VALUES (?, ?)', [UUID, domain]);
            console.log('Insert successful:', result);
            return {
                statusCode: 200,
                body: JSON.stringify("Domain Name added to Database"),
            };
        }
        catch (error) {
            console.error('Failed to insert into user_websites:', error);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Failed to insert domain" }),
            };
        }
    }
    catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Database connection failed", error: error }),
        };
    }
};
exports.handler = handler;
