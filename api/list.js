const dynamoDbLib = require("../libs/dynamodb-lib");
const responseLib = require("../libs/response-lib");

module.exports.main = async(event, context) => {
    const params = {
        TableName: process.env.NOTES_TABLE,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be Identity Pool identity id
        //   of the authenticated user
        KeyConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": event.requestContext.identity.cognitoIdentityId
        }
    };

    try {
        const result = await dynamoDbLib.call("query", params);
        return responseLib.success(result.Items);
    } catch (e) {
        console.log(e);
        return responseLib.failure({ status: false });
    }
};