import React, { useState, useEffect } from 'react';
import { getProducts, getLocations, getMovements, generateReport } from '../services/api';
import { Table, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Movements = ({ onAddEntry, onAddExit }) => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMovements();
    }, []);

    const loadMovements = () => {
        setLoading(true);
        getMovements()
            .then((response) => {
                const sortedMovements = response.data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
                setMovements(sortedMovements);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleGenerateReport = () => {
        generateReport()
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'relatorio_movimentacoes.pdf');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.error("Erro ao gerar relatório:", error));
    };

    return (
        <Card className="bg-dark text-light p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Movimentações de Produtos</Card.Title>

                <div className="d-flex justify-content-between mb-3">
                    <Button variant="success" onClick={onAddEntry}>
                        Adicionar Entrada
                    </Button>
                    <Button variant="danger" onClick={onAddExit}>
                        Adicionar Saída
                    </Button>
                    {/* <Button variant="primary" onClick={handleGenerateReport}>
                        Gerar Relatório
                    </Button> */}
                </div>

                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="light" />
                        <p className="text-light mt-3">Carregando movimentações...</p>
                    </div>
                ) : (
                    <Table responsive bordered hover variant="dark" className="mt-3">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Data e Hora</th>
                                <th>Local</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.length > 0 ? (
                                movements.map((movement) => (
                                    <tr key={movement.id}>
                                        <td>{movement.product.name}</td>
                                        <td>{movement.type === 'entry' ? 'Entrada' : 'Saída'}</td>
                                        <td>{movement.quantity}</td>
                                        <td>{new Date(movement.date_time).toLocaleString()}</td>
                                        <td>{movement.location.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Nenhuma movimentação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default Movements;
