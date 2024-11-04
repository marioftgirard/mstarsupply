import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import { Table, Button, Card, Modal, Spinner } from 'react-bootstrap';

const ProductList = ({ onSelectProduct, onAddProduct, onEditProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    // Carregar lista de produtos
    const loadProducts = () => {
        setLoading(true);
        getProducts()
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // Exibir o modal de confirmação de exclusão
    const handleDelete = (id) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    // Confirmar exclusão do produto
    const confirmDelete = () => {
        deleteProduct(productToDelete)
            .then(() => {
                setShowDeleteModal(false);
                loadProducts();
            })
            .catch(() => setShowDeleteModal(false));
    };

    return (
        <Card className="bg-ms-dark text-light p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title className="text-center mb-4">Lista de Produtos</Card.Title> 

                <Button
                    variant="btn bg-ms-blue text-light"
                    onClick={onAddProduct}
                    className="mb-3 w-100"
                >
                    Adicionar Novo Produto
                </Button>               

                {/* Exibir loading enquanto carrega os produtos */}
                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="light" />
                        <p className="text-light mt-3">Carregando produtos...</p>
                    </div>
                ) : (
                    <Table responsive bordered hover variant="dark" className="mt-3 table-rounded">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Número de Registro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.registration_number}</td>
                                        <td>
                                            <Button
                                                variant="btn btn-success-ms text-light"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => onSelectProduct(product.id)}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="btn btn-alert-ms text-light"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => onEditProduct(product.id)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="btn btn-danger-ms text-light"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>

            {/* Modal de confirmação de exclusão */}
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
                <Modal.Body>Tem certeza de que deseja excluir este produto?</Modal.Body>
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

export default ProductList;
