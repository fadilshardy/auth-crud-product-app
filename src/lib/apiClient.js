import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = 'https://test.employee.tokoweb.xyz/api';

const client = axios.create({
    baseURL: API_BASE_URL,
});

client.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
});


export default client;