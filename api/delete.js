const dynamoDbLib = require("../libs/dynamodb-lib");
const responseLib = require("../libs/response-lib");

module.exports.main = async(event, context) => {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
            userid: event.requestContext.identity.cognitoIdentityId,
            noteid: event.pathParameters.id
        }
    };

    try {
        await dynamoDbLib.call("delete", params);
        return responseLib.success({ status: true });
    } catch (e) {
        console.log(e);
        return responseLib.failure({ status: false });
    }
};