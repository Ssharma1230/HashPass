"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST, // RDS endpoint
    user: process.env.DB_USER, // RDS username
    password: process.env.DB_PASS, // RDS password
    database: process.env.DB_NAME,
};
const handler = async (event, context) => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
    console.log('CONTEXT: \n' + JSON.stringify(context, null));
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
    const uuid = request_body;
    const connection = await (0, promise_1.createConnection)(dbConfig);
    ;
    try {
        const [rows] = await connection.execute('SELECT * FROM sec_questions WHERE uuid = ?;', [uuid] // Pass the UUID as a parameter
        );
        console.log(rows);
        await connection.end();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: rows })
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Error with DB" })
        };
    }
};
module.exports = { handler };
