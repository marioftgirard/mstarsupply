import React, { useState, useEffect } from 'react';
import { getMovements, generateReport } from '../services/api';
import { Table, Button, Card, Spinner } from 'react-bootstrap';


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
                setMovements(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleGenerateReport = async () => {
        generateReport()
            .then((response) => {
                
                const now = new Date();
                const formattedDate = now.toISOString().split('T')[0]; // Formato: yyyy-mm-dd
                const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Formato: hh-mm-ss

                
                const fileName = `Entries_and_Exits_Report_${formattedDate}_${formattedTime}.pdf`;               
                const url = window.URL.createObjectURL(new Blob([response.data]));
                console.log(response);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => console.error("Erro ao gerar relatório:", error));
    };

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Movimentações de Produtos</Card.Title>

                <div className="d-flex justify-content-between mb-3">
                    <Button variant="success-ms text-light" onClick={onAddEntry}>
                        Adicionar Entrada
                    </Button>
                    <Button variant="danger-ms text-light" onClick={onAddExit}>
                        Adicionar Saída
                    </Button>
                    {<Button variant="primary-ms text-light" onClick={handleGenerateReport}>
                        Gerar Relatório
                    </Button>}
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
                                movements.map((movement,index) => (
                                    <tr key={index}>
                                        <td>{movement.product_name}</td>
                                        <td>{movement.type}</td>
                                        <td>{movement.quantity}</td>
                                        <td>{new Date(movement.date_time).toLocaleString()}</td>
                                        <td>{movement.location_name}</td>
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
