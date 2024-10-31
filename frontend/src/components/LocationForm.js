import React, { useState, useEffect } from 'react';
import { addLocation, updateLocation, getLocationById } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';

const LocationForm = ({ locationId, onSave }) => {
    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (locationId) {
            getLocationById(locationId).then((response) => setForm(response.data));
        }
    }, [locationId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (locationId) {
            updateLocation(locationId, form).then(onSave);
        } else {
            addLocation(form).then(onSave);
        }
    };

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">
                    {locationId ? 'Editar Local' : 'Adicionar Local'}
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="locationName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nome do Local"
                            required
                            className="border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="locationDescription">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição do Local"
                            className="border-secondary"
                            rows={3}
                        />
                    </Form.Group>

                    <Button variant="btn bg-ms-blue text-light" type="submit" className="w-100">
                        {locationId ? 'Atualizar Local' : 'Adicionar Local'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default LocationForm;
