import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import ProductForm from './ProductForm';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        getProducts().then((response) => setProducts(response.data));
    };

    const handleDelete = (id) => {
        deleteProduct(id).then(loadProducts);
    };

    const handleSave = () => {
        setEditingProductId(null);
        loadProducts();
    };

    return (
        <div>
            <h2>Lista de Produtos</h2>
            {editingProductId ? (
                <ProductForm productId={editingProductId} onSave={handleSave} />
            ) : (
                <ProductForm onSave={handleSave} />
            )}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.registration_number}
                        <button onClick={() => setEditingProductId(product.id)}>Editar</button>
                        <button onClick={() => handleDelete(product.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
