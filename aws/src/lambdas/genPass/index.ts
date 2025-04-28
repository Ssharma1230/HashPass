import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { calculatePassword } from './src/password_generator';

const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
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
        //const dataToHash = typeof event.body === 'string' ? event.body : JSON.stringify(event.body, null, 2);
        //const slt = 'my-static-salt'; // Figure out how to get this value from event as a json and stringify it like in the line above

        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        const salt: string = body.salt;
        const domain_name: string = body.domain_name;
        const encrypted_userid: string = body.encrypted_userid;

        const strong_password = await calculatePassword(salt, domain_name, encrypted_userid);


        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
          },
          body: JSON.stringify({ hash: strong_password }),
        };
      } catch (error) {
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