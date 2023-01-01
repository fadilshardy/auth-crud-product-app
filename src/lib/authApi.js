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

export const logout = async (token = null) => {
    try {
        const res = await client.post(`/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        console.error(error.response.data.message);
    }
}

