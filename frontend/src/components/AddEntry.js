import React, { useState, useEffect } from 'react';
import { addEntry, getProducts, getLocations } from '../services/api';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { formatDateTime } from '../utils/formatDateTime';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    date_time: Yup.date()
        .typeError("A data é inválida.")
        .required("A data e hora são obrigatórias.")
});

const AddEntry = ({ onSave }) => {
    const [form, setForm] = useState({
        product_id: '',
        quantity: '',
        date_time: '',
        location_id: ''
    });
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

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



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setError();
        try {
            await validationSchema.validate(form, { abortEarly: false });
            const formattedForm = { ...form, date_time: formatDateTime(form.date_time) };
            addEntry(formattedForm)
                .then((response) => {
                    setMessage(response.data.message);
                    setError(null);
                    onSave();
                })
                .catch((error) => {
                    setError(error.response?.data?.error || "Erro ao registrar entrada");
                    setMessage(null);
                });
        } catch (validationErrors) {

            if (validationErrors.inner) {
                const formattedErrors = {};
                validationErrors.inner.forEach(err => {
                    formattedErrors[err.path] = err.message;
                });
                setErrors(formattedErrors);
            } else {                
                setError("Ocorreu um erro ao validar os dados.");
            }

        }
    };

    return (
        <Card className="bg-dark text-light p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Registrar Entrada de Produto</Card.Title>

                {message && <Alert dismissible="true" variant="success">{message}</Alert>}
                {error && <Alert dismissible="true" variant="danger">{error}</Alert>}

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
                            min="1"
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
                            isInvalid={!!errors.date_time}
                        />
                        {errors.date_time && <Alert variant="danger">{errors.date_time}</Alert>}

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
                        Registrar Entrada
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddEntry;
