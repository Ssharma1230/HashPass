import { APIGatewayEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import argon2 from 'argon2'

const handler = async (event: APIGatewayEvent | APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
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
    try {
        const dataToHash = typeof event.body === 'string' ? event.body : JSON.stringify(event.body, null, 2);
        const slt = Buffer.from('my-static-salt', 'utf8');
        const hashValue = await argon2.hash(dataToHash, {
          salt: slt,
          type: argon2.argon2id,
          timeCost: 2,          // Number of iterations.
          memoryCost: 65536,    // Memory in KiB.
          hashLength: 32,       // Length of the resulting hash.
          parallelism: 1,
        });
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
          },
          body: JSON.stringify({ hash: hashValue }),
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