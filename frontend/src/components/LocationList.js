import React, { useState, useEffect } from 'react';
import { getLocations, deleteLocation } from '../services/api';
import { Table, Button, Card, Modal, Spinner } from 'react-bootstrap';

const LocationList = ({ onEditLocation, onAddLocation }) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = () => {
        setLoading(true);
        getLocations()
            .then((response) => {
                setLocations(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleDelete = (id) => {
        setLocationToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteLocation(locationToDelete)
            .then(() => {
                setShowDeleteModal(false);
                loadLocations();
            })
            .catch(() => setShowDeleteModal(false));
    };

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Locais de Armazenamento</Card.Title>

                <Button
                    variant="btn bg-ms-blue text-light"
                    onClick={onAddLocation}
                    className="mb-3 w-100"
                >
                    Adicionar Novo Local
                </Button>

                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="light" />
                        <p className="text-light mt-3">Carregando locais...</p>
                    </div>
                ) : (
                    <Table responsive bordered hover variant="dark" className="mt-3 table-rounded">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length > 0 ? (
                                locations.map((location) => (
                                    <tr key={location.id}>
                                        <td>{location.name}</td>
                                        <td>{location.description}</td>
                                        <td>
                                            <Button
                                                variant="btn btn-alert-ms text-light"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => onEditLocation(location.id)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="btn btn-danger-ms text-light"
                                                size="sm"
                                                onClick={() => handleDelete(location.id)}
                                            >
                                                Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Nenhum local encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>

            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja excluir este local de armazenamento?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default LocationList;
