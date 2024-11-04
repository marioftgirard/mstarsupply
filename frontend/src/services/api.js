import axios from 'axios';

// Configuração da base URL da API
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Funções de CRUD para produtos
export const addProduct = (product) => api.post('/products', product);
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Funções de CRUD para locais de armazenamento (Location)


export const addLocation = (location) => api.post('/locations', location);
export const getLocations = () => api.get('/locations');
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const updateLocation = (id, location) => api.put(`/locations/${id}`, location);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

// Função para adicionar uma nova entrada de produto
export const addEntry = (entry) => api.post('/entries', entry);

// Função para adicionar uma nova saída de produto
export const addExit = (exit) => api.post('/exits', exit);

// Função para obter todas as movimentações (entradas e saídas)
export const getMovements = () => api.get('/movements');

// Função para gerar relatório de movimentações (entradas e saídas)
export const generateReport = async () => await api.get('/report', {
    responseType: 'blob',  // Importante: Define o tipo de resposta como blob para lidar com arquivos binários
    headers: {
        'Cache-Control': 'no-cache',  // Evita problemas de cachê
        'Pragma': 'no-cache',
        'Expires': '0',
    }
});