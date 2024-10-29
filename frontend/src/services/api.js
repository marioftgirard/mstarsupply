import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const addProduct = (product) => api.post('/products', product);
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);