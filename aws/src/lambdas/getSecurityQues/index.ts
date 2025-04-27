import { APIGatewayEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST, // RDS endpoint
    user: process.env.DB_USER, // RDS username
    password: process.env.DB_PASS, // RDS password
    database: process.env.DB_NAME,
};

const handler = async (event: APIGatewayEvent | APIGatewayProxyEventV2 ): Promise<APIGatewayProxyResultV2> => {
    console.log('Received event:', JSON.stringify(event, null));
    let httpMethod: string;
    try {
      httpMethod = (event as APIGatewayProxyEventV2).requestContext.http.method;
    } catch (error) {
      if (error instanceof Error) {
        console.log("APIGatewayEvent");
      }
      httpMethod = (event as APIGatewayEvent).httpMethod;
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
            request_body = JSON.parse(event.body) 
        } else {
            console.log("No body found");
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No body found" })
            };
        }
    } catch (error) {
        console.error("Invalid JSON format", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON format" }),
        };
    }

    const uuid = request_body;
    const connection = await createConnection(dbConfig);; 
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM sec_questions WHERE uuid = ?;', 
            [uuid] // Pass the UUID as a parameter
        );    
        console.log(rows);
        await connection.end();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: rows })
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Error with DB" })
        };
    }
};

module.exports = { handler };