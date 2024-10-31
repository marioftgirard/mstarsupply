import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, getProductById } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';

const ProductForm = ({ productId, onSave }) => {
    const [form, setForm] = useState({
        name: '',
        registration_number: '',
        manufacturer: '',
        type: '',
        description: ''
    });

    // Carregar dados do produto se estiver em modo de edição
    useEffect(() => {
        if (productId) {
            getProductById(productId).then((response) => setForm(response.data));
        }
    }, [productId]);

    // Manipulador de mudanças de formulário
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manipulador de envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        if (productId) {
            updateProduct(productId, form).then(onSave);
        } else {
            addProduct(form).then(onSave);
        }
    };

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">
                    {productId ? 'Editar Produto' : 'Adicionar Produto'}
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nome do Produto"
                            required
                            className="border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productRegistrationNumber">
                        <Form.Label>Número de Registro</Form.Label>
                        <Form.Control
                            type="text"
                            name="registration_number"
                            value={form.registration_number}
                            onChange={handleChange}
                            placeholder="Número de Registro"
                            required
                            className="border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productManufacturer">
                        <Form.Label>Fabricante</Form.Label>
                        <Form.Control
                            type="text"
                            name="manufacturer"
                            value={form.manufacturer}
                            onChange={handleChange}
                            placeholder="Fabricante"
                            className="border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productType">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            placeholder="Tipo"
                            className="border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productDescription">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição do Produto"
                            className="border-secondary"
                            rows={3}
                        />
                    </Form.Group>

                    <Button variant="btn bg-ms-blue text-light" type="submit" className="w-100">
                        {productId ? 'Atualizar Produto' : 'Adicionar Produto'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ProductForm;
