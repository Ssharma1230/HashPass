import { APIGatewayEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createConnection, RowDataPacket } from 'mysql2';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

module.exports.handler = async (event: APIGatewayEvent | APIGatewayProxyEventV2 ): Promise<APIGatewayProxyResultV2> => {
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
  if (event.body) {
    request_body = JSON.parse(event.body);
  } else {
    console.log("No body found");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No body found" }),
    };
  }

  const { uuid, enc_uuid, enc_name, email, enc_phone, enc_answers } = request_body;
  const time_creation = new Date().toISOString();

  let connection;

  try {
    connection = createConnection(dbConfig).promise();

    const [existing] = await connection.execute<RowDataPacket[]>(
      'SELECT uuid FROM users WHERE enc_email = ?',
      [email]
    );

    if (existing.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User already signed up." }),
      };
    }

    await connection.execute(
      'INSERT INTO users (uuid, enc_uuid, enc_name, enc_email, enc_phone_num, enc_time_creation) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid, enc_uuid, enc_name, email, enc_phone, time_creation]
    );

    await connection.execute(
      'INSERT INTO sec_questions (uuid, enc_uuid, enc_question1, enc_question2, enc_question3, enc_question4, enc_question5, enc_question6, enc_question7, enc_question8, enc_question9, enc_question10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid, enc_uuid, ...enc_answers]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User and security questions inserted successfully!" }),
    };

  } catch (error) {
    console.error("Database error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Database operation failed", error: error }),
    };

  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
