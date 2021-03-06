const uuid = require("uuid");
const dynamoDbLib = require("../libs/dynamodb-lib");
const responseLib = require("../libs/response-lib");

module.exports.main = async(event, context) => {
    // Request body is JSON encoded string in 'event.body' 
    const data = JSON.parse(event.body);
   
    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: {
            // the attributes of item to be created
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            interviewee: data.interviewee,
            skills: data.skills,
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now(),
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        return responseLib.success(params.Item);
    } catch (e) {
        console.log(e);
        return responseLib.failure({ status: false });
    }
};