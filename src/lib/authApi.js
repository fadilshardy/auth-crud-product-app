import client from './apiClient';


export const login = async (payload) => {
    try {
        const res = await client.post(`/login`, payload);

        const user = res.data;

        if (res.status === 200 && user) {
            return user;
        }

        return null;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const logout = async () => {
    try {
        return await client.post(`/logout`);
    } catch (error) {
        console.error(error);
    }
}

