import { APIGatewayEvent } from "aws-lambda";

const handler = async (event: APIGatewayEvent) => {
    console.log("Event: ", JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from signup lambda!"
        }),
    }
}; 

module.exports = { handler };