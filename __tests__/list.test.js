const axios = require('axios');
const stack = require('../.build/stack.json');

console.log("stack.ServiceEndpoint: " + stack.ServiceEndpoint);

const instance = axios.create({
    baseURL: stack.ServiceEndpoint,
    timeout: 1000,
    headers: {'requestContext': '{cognitoIdentityId: "b722f9fe-3639-473e-9595-6986161019c2"}'}
});

test('list all notes for user', async () => {
    
    const { status } = await instance({
        url: '/notes',
        method: 'get'
    });
    
    expect(status).toEqual(200);
});