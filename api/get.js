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
        const result = await dynamoDbLib.call("get", params);
        if (result.Item) {
            return responseLib.success(result.Item);
        } else {
            return responseLib.failure({ status: false, error: "Item not found" });
        }
        
    } catch (e) {
        console.log(e);
        return responseLib.failure({ status: false });
    }
}