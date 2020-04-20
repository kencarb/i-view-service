const dynamoDbLib = require("../libs/dynamodb-lib");
const responseLib = require("../libs/response-lib");

module.exports.main = async(event, context) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
            userid: event.requestContext.identity.cognitoIdentityId,
            noteid: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachment = :attachment, interviewee = :interviewee, skills = :skills",
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":content": data.content || null,
            ":interviewee": data.interviewee || null,
            ":skills": data.skills || null
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW"
    };

    try {
        await dynamoDbLib.call("update", params);
        return responseLib.success({ status: true });
    } catch (e) {
        console.log(e);
        return responseLib.failure({ status: false });
    }
};
