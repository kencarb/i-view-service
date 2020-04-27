//const axios = require('axios');
//const stack = require('../.build/stack.json');
const iamAuth = require("../libs/iam-auth-lib.js");
//var await = require('asyncawait/await');

(async () => {
    await iamAuth.login('admin@example.com', 'Passw0rd!');
})();

test('list all notes for user', async () => {
    
    const { status } = await iamAuth.invokeApig({
        url: '/notes',
        method: 'get'
    });
    
    expect(status).toEqual(200);
});