import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';

function App() {
    // Estado para gerenciar qual produto está sendo exibido em detalhes
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Função para atualizar o produto selecionado ao clicar na lista
    const handleSelectProduct = (id) => {
        setSelectedProductId(id);
    };

    return (
        <div>
            <h1>Gestão de Produtos</h1>

            {/* Se nenhum produto estiver selecionado, exibe a lista de produtos */}
            {!selectedProductId ? (
                <ProductList onSelectProduct={handleSelectProduct} />
            ) : (
                <>
                    {/* Exibe os detalhes do produto selecionado */}
                    <ProductDetails productId={selectedProductId} />
                    <button onClick={() => setSelectedProductId(null)}>
                        Voltar para a lista de produtos
                    </button>
                </>
            )}
        </div>
    );
}

export default App;