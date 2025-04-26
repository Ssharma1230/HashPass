"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};
const handler = async (event) => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
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
    const { uuid } = request_body;
    const connection = await (0, promise_1.createConnection)(dbConfig);
    ;
    try {
        const [rows] = await connection.execute('SELECT domain FROM blocked_domains WHERE uuid = ?;', [uuid]);
        console.log(rows);
        await connection.end();
        const domains = rows.map(row => row.domain);
        return {
            statusCode: 200,
            body: JSON.stringify(domains)
        };
    }
    catch (error) {
        console.error("Error inserting data:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Error with DB: " + error })
        };
    }
};
module.exports = { handler };
