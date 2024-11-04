import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import LocationList from './components/LocationList';
import LocationForm from './components/LocationForm';
import Movements from './components/Movements';
import AddEntry from './components/AddEntry';
import AddExit from './components/AddExit';
import { Container, Navbar, Nav } from 'react-bootstrap';
import StockBalances from './components/StockBalances';

function App() {
    const [view, setView] = useState('list');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState(null);

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

    const showLocationList = () => {
        setView('locationList');
        setSelectedLocationId(null);
    };

    const showLocationForm = (id = null) => {
        setSelectedLocationId(id);
        setView('locationForm');
    };

    const showMovements = () => {
      setView('movements');
  };

    const showAddEntry = () => setView('addEntry');
    const showAddExit = () => setView('addExit');

    return (
        <div className="text-light" style={{ minHeight: '100vh' }}>
            <Navbar bg="ms-dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#">Gestão de Estoque</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link href="#" onClick={showProductList} className="text-light">
                            Produtos
                        </Nav.Link>
                        <Nav.Link href="#" onClick={showLocationList} className="text-light">
                            Locais de Armazenamento
                        </Nav.Link>
                        <Nav.Link href="#" onClick={showMovements} className="text-light">
                            Movimentações
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
                {view === 'locationList' && (
                    <LocationList
                        onEditLocation={(id) => showLocationForm(id)}
                        onAddLocation={() => showLocationForm()}
                    />
                )}
                {view === 'locationForm' && (
                    <LocationForm
                        locationId={selectedLocationId}
                        onSave={showLocationList}
                    />
                )}
                {view === 'movements' && (
                    <>
                    <Movements
                        onAddEntry={showAddEntry}
                        onAddExit={showAddExit}
                    />
                    <StockBalances></StockBalances>
                    </>
                )}
                {view === 'addEntry' && (
                    <AddEntry onSave={showMovements} />
                )}
                {view === 'addExit' && (
                    <AddExit onSave={showMovements} />
                )}          
            </Container>
        </div>
    );
}

export default App;
