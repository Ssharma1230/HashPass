import { APIGatewayEvent, Context } from "aws-lambda";

const handler = async (event: APIGatewayEvent, context: Context) => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
    console.log('CONTEXT: \n' + JSON.stringify(context, null));
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" })
    };
}; 

module.exports = { handler };