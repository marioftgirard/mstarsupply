import React, { useState, useEffect } from 'react';
import { addExit, getProducts, getLocations } from '../services/api';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { formatDateTime } from '../utils/formatDateTime';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    date_time: Yup.date()
        .typeError("A data é inválida.")
        .required("A data e hora são obrigatórias.")
});

const AddExit = ({ onSave }) => {
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
            addExit(formattedForm)
                .then((response) => {
                    setMessage(response.data.message);
                    setError(null); // 
                    onSave();
                })
                .catch((error) => {
                    setError(error.response?.data || "Erro ao registrar saída");
                    console.error("Erro ao registrar saída:", error)
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
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Registrar Saída de Produto</Card.Title>

                {message && <Alert variant="success">{message}</Alert>}
                {error &&
                    <Alert variant="danger" dismissible >
                        <p>{error.error}</p>
                        {typeof error.available_balances === 'string' ?
                            <p>{error.available_balances}</p> :
                            error.available_balances.map(balance => <p>Local: {balance.location_name} - Saldo disponível: {balance.available_balance} </p>)
                        }
                    </Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Produto</Form.Label>
                        <Form.Select
                            name="product_id"
                            value={form.product_id}
                            onChange={handleChange}
                            required
                            className="border-secondary"

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
                            className="border-secondary"
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
                            className="border-secondary"
                            isInvalid={!!errors.date_time}
                        />
                        {errors.date_time && <Alert variant="danger" dismissible >{errors.date_time}</Alert>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Local</Form.Label>
                        <Form.Select
                            name="location_id"
                            value={form.location_id}
                            onChange={handleChange}
                            required
                            className="border-secondary"
                        >
                            <option value="">Selecione o local</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Button variant="btn bg-ms-blue text-light" type="submit" className="w-100">
                        Registrar Saída
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddExit;
