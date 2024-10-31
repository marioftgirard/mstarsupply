import React, { useEffect, useState } from 'react';
import { getProductById } from '../services/api';
import { Card, Button, Spinner } from 'react-bootstrap';

const ProductDetails = ({ productId, onBack }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar os detalhes do produto ao montar o componente
        getProductById(productId)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="light" />
                <p className="text-light mt-3">Carregando detalhes do produto...</p>
            </div>
        );
    }

    if (!product) {
        return <p className="text-light">Produto não encontrado.</p>;
    }

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">{product.name}</Card.Title>
                <Card.Text>
                    <strong>Número de Registro:</strong> {product.registration_number}
                </Card.Text>
                <Card.Text>
                    <strong>Fabricante:</strong> {product.manufacturer || 'N/A'}
                </Card.Text>
                <Card.Text>
                    <strong>Tipo:</strong> {product.type || 'N/A'}
                </Card.Text>
                <Card.Text>
                    <strong>Descrição:</strong> {product.description || 'N/A'}
                </Card.Text>
                <Button variant="btn bg-ms-blue text-light" onClick={onBack} className="mt-4 w-100">
                    Voltar para a Lista de Produtos
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductDetails;
