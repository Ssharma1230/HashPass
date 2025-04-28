Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const dbConfig = {
    host: process.env.DB_HOST, // RDS endpoint
    user: process.env.DB_USER, // RDS username
    password: process.env.DB_PASS, // RDS password
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
    const { UUID } = request_body;
    console.log("Parsed UUID:", UUID);
    try {
        const connection = await (0, promise_1.createConnection)(dbConfig);
        const [rows] = await connection.execute('SELECT enc_uuid, enc_email, enc_name, enc_phone_num FROM users WHERE uuid = ?', [UUID]);
        await connection.end();
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    }
    catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Database connection failed", error: error }),
        };
    }
};
module.exports = { handler };