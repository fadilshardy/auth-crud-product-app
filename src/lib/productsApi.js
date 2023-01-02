import client from './apiClient';


export const getProducts = async () => {
    try {
        const res = await client.get(`/product`);
        const products = res.data;

        if (res.status === 200 && products) {
            return products.data;
        }

        return null;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const detailProduct = async (id) => {
    try {
        const res = await client.get(`/product/show?product_id=${id}`);
        const product = res.data;

        if (res.status === 200 && product) {
            return product.data;
        }

        return null;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const createProduct = async (payload) => {
    try {
        const res = await client.post(`/product/store`, payload);
        const product = res.data;

        if (res.status === 200 && product) {
            return product.data;
        }

        return null;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const updateProduct = async (payload) => {
    try {
        const res = await client.post(`product/update`, payload);
        const product = res.data;

        if (res.status === 200 && product) {
            return product.data;
        }

        return null;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const deleteProduct = async (id) => {
    try {
        const res = await client.delete(`product/${id}`);
        return res.status;

    } catch (error) {
        throw new Error(error.response.data.message);
    }
}



