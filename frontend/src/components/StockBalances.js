import React, { useState, useEffect } from 'react';
import { getStockBalances } from '../services/api'; // Importa a função da API
import { Table, Card, Spinner, Alert } from 'react-bootstrap';

const StockBalances = () => {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setLoading(true);
        getStockBalances()
            .then((response) => {
                setBalances(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Erro ao carregar os saldos");
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3">Carregando saldos...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    return (
        <Card className="bg-ms-dark text-light p-4 mt-4 mb-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center">Saldos de Produtos por Local</Card.Title>
                <Table responsive bordered hover variant="dark" className="mt-3">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Local</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balances.length > 0 ? (
                            balances.map((balance) => (
                                <tr key={`${balance.product_id}-${balance.location_id}`}>
                                    <td>{balance.product_name}</td>
                                    <td>{balance.location_name}</td>
                                    <td>{balance.balance}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    Nenhum saldo disponível.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default StockBalances;
