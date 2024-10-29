import React, { useEffect, useState } from 'react';
import { getProductById } from '../services/api';

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProductById(productId).then((response) => setProduct(response.data));
    }, [productId]);

    if (!product) return <div>Carregando...</div>;

    return (
        <div>
            <h3>{product.name}</h3>
            <p>Registro: {product.registration_number}</p>
            <p>Fabricante: {product.manufacturer}</p>
            <p>Tipo: {product.type}</p>
            <p>Descrição: {product.description}</p>
        </div>
    );
};

export default ProductDetails;
