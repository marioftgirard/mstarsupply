import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import { Container, Navbar, Nav } from 'react-bootstrap';

function App() {
    const [view, setView] = useState('list');
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Funções de navegação
    const showProductList = () => {
        setView('list');
        setSelectedProductId(null);
    };

    const showProductDetails = (id) => {
        setSelectedProductId(id);
        setView('details');
    };

    const showProductForm = (id = null) => {
        setSelectedProductId(id);
        setView('form');
    };

    return (
        <div className="text-light" style={{ minHeight: '100vh' }}>
            <Navbar bg="ms" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#">Gestão de Produtos</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link href="#" onClick={showProductList} className="text-light">
                            Lista de Produtos
                        </Nav.Link>
                        <Nav.Link href="#" onClick={() => showProductForm()} className="text-light">
                            Adicionar Produto
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                {view === 'list' && (
                    <ProductList
                        onSelectProduct={showProductDetails}
                        onAddProduct={() => showProductForm()}
                        onEditProduct={(id) => showProductForm(id)}
                    />
                )}
                {view === 'details' && selectedProductId && (
                    <ProductDetails
                        productId={selectedProductId}
                        onBack={showProductList}
                        onEdit={() => showProductForm(selectedProductId)}
                    />
                )}
                {view === 'form' && (
                    <ProductForm
                        productId={selectedProductId}
                        onSave={showProductList}
                    />
                )}
            </Container>
        </div>
    );
}

export default App;
