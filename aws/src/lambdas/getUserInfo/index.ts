import { APIGatewayEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createConnection } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export const handler = async (event: APIGatewayEvent | APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
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
    try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    let request_body;
    if (event.body) {
      request_body = JSON.parse(event.body);
    } else {
      console.log("No body found");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No body found" }),
      };
    }

    const { UUID } = request_body;

    console.log("Parsed UUID:", UUID);

    try {
      const connection = await createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT enc_email, enc_name, enc_phone_num FROM users WHERE uuid = ?', [UUID]);
      await connection.end();
  
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
  
    } catch (error) {
      console.error("Database error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Database connection failed", error: error }),
      };
    }
  } catch (error) {
    console.error("Unhandled error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error"
      }),
    };
  }
};