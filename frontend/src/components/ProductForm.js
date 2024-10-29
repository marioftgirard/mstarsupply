import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, getProductById } from '../services/api';

const ProductForm = ({ productId, onSave }) => {
    const [form, setForm] = useState({ name: '', registration_number: '', manufacturer: '', type: '', description: '' });

    useEffect(() => {
        if (productId) {
            getProductById(productId).then((response) => setForm(response.data));
        }
    }, [productId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (productId) {
            updateProduct(productId, form).then(onSave);
        } else {
            addProduct(form).then(onSave);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" required />
            <input name="registration_number" value={form.registration_number} onChange={handleChange} placeholder="Registro" required />
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="Fabricante" />
            <input name="type" value={form.type} onChange={handleChange} placeholder="Tipo" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" />
            <button type="submit">{productId ? 'Atualizar' : 'Adicionar'} Produto</button>
        </form>
    );
};

export default ProductForm;