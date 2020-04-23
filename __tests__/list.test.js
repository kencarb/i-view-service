import axios from 'axios';
import { ServiceEndpoint as API_GATEWAY_BASE_URL } from '../.build/stack.json';

const instance = axios.create({
    baseURL: `${API_GATEWAY_BASE_URL}`,
    timeout: 1000,
    headers: {'requestContext': '{cognitoIdentityId: "USER-SUB-1234"}'}
});

test('list all notes for user', async () => {
    
    const { status } = await instance({
        url: '/notes',
        method: 'get'
    });
    
    expect(status).toEqual(200);
});