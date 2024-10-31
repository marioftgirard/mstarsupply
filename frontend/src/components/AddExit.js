import React, { useState, useEffect } from 'react';
import { addExit, getProducts, getLocations } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';
import {formatDateTime} from '../utils/formatDateTime';

const AddExit = ({ onSave }) => {
    const [form, setForm] = useState({
        product_id: '',
        quantity: '',
        date_time: '',
        location_id: ''
    });
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        loadProducts();
        loadLocations();
    }, []);

    const loadProducts = () => {
        getProducts()
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    };

    const loadLocations = () => {
        getLocations()
            .then((response) => setLocations(response.data))
            .catch((error) => console.error("Erro ao carregar locais:", error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedForm = { ...form, date_time: formatDateTime(form.date_time) };
        addExit(formattedForm)
            .then(onSave)
            .catch((error) => console.error("Erro ao registrar saída:", error));
    };

    return (
        <Card className="bg-dark text-light p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Registrar Saída de Produto</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Produto</Form.Label>
                        <Form.Select
                            name="product_id"
                            value={form.product_id}
                            onChange={handleChange}
                            required
                            className="bg-dark text-light border-secondary"
                        >
                            <option value="">Selecione o produto</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Quantidade"
                            required
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Data e Hora</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="date_time"
                            value={form.date_time}
                            onChange={handleChange}
                            required
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Local</Form.Label>
                        <Form.Select
                            name="location_id"
                            value={form.location_id}
                            onChange={handleChange}
                            required
                            className="bg-dark text-light border-secondary"
                        >
                            <option value="">Selecione o local</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Registrar Saída
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddExit;
