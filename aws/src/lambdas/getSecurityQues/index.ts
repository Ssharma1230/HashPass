import { APIGatewayEvent, Context } from "aws-lambda";
import { createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST, // RDS endpoint
    user: process.env.DB_USER, // RDS username
    password: process.env.DB_PASS, // RDS password
    database: process.env.DB_NAME,
};

const handler = async (event: APIGatewayEvent, context: Context) => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
    console.log('CONTEXT: \n' + JSON.stringify(context, null));

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM UserInfo.sec_questions;');
    console.log(rows);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" })
    };
};

module.exports = { handler };