"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST, // RDS endpoint
    user: process.env.DB_USER, // RDS username
    password: process.env.DB_PASS, // RDS password
    database: process.env.DB_NAME,
};
const handler = async (event) => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
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
    try {
        if (event.body) {
            request_body = JSON.parse(event.body);
        }
        else {
            console.log("No body found");
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No body found" })
            };
        }
    }
    catch (error) {
        console.error("Invalid JSON format", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON format" }),
        };
    }
    console.log("Request body:", request_body);
    console.log("Process: ", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
    const { uuid, enc_uuid, enc_questions } = request_body;
    try {
        const connection = await (0, promise_1.createConnection)(dbConfig);
        const query = `INSERT INTO UserInfo.sec_questions (uuid, enc_uuid, enc_question1, enc_question2, enc_question3, enc_question4, enc_question5, enc_question6, enc_question7, enc_question8, enc_question9, enc_question10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const values = [uuid, enc_uuid, ...enc_questions];
        await connection.execute(query, values);
        await connection.end();
    }
    catch (error) {
        console.error("Error inserting data:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Error with DB" })
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" })
    };
};
module.exports = { handler };
