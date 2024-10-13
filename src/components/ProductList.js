import React, { useState, useEffect } from 'react';
import axios from '../api';
import './style.css';
import { Button, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // CartContext'dan foydalanish
import { NumberFormat } from '../hooks/NumberFormat';

const ProductList = () => {
    const { addToCart } = useCart(); // CartContext'dan addToCart ni oling
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        purchasePrice: '',
        sellingPrice: '',
        quantity: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [animateProductId, setAnimateProductId] = useState(null); // Animatsiya uchun state

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, description, purchasePrice, sellingPrice, quantity } = newProduct;
        return name && description && purchasePrice && sellingPrice && quantity;
    };

    const addProduct = async () => {
        if (!validateForm()) {
            setFormError(true);
            message.error('Iltimos, barcha maydonlarni to\'ldiring!');
            return;
        }

        try {
            if (editMode) {
                await axios.put(`/api/products/${editingProductId}`, newProduct);
                message.success('Mahsulot yangilandi!');
                setEditMode(false);
                setEditingProductId(null);
            } else {
                await axios.post('/api/products', newProduct);
                message.success('Mahsulot qo\'shildi!');
            }

            fetchProducts();
            setNewProduct({ name: '', description: '', purchasePrice: '', sellingPrice: '', quantity: '' });
            setShowForm(false);
            setFormError(false);
        } catch (error) {
            console.error(error);
        }
    };

    const addToProduct = (product) => {
        if (product.quantity > 0) { // Mahsulot miqdori 0 dan katta bo'lsa
            const updatedProduct = {
                ...product,
                quantity: 1 // Quantityni 1 taga kamaytirish
            };
            addToCart(updatedProduct); // Yangilangan mahsulotni savatga qo'shish
            setAnimateProductId(product._id); // Animatsiya boshlanishi uchun IDni saqlash
            setTimeout(() => setAnimateProductId(null), 1000); // 1 soniyadan keyin animatsiyani o'chirish
        } else {
            message.error('Mahsulot miqdori yetarli emas!'); // Miqdor nol bo'lsa xabar chiqarish
        }
    };

    const closeForm = async () => {
        setNewProduct({ name: '', description: '', purchasePrice: '', sellingPrice: '', quantity: '' });
        setShowForm(false);
        setFormError(false);
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`);
            message.success('Mahsulot o\'chirildi!');
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const editProduct = (product) => {
        setEditMode(true);
        setEditingProductId(product._id);
        setNewProduct({
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            sellingPrice: product.sellingPrice,
            quantity: product.quantity
        });
        setShowForm(true);
    };

    return (
        <div className="product-list">
            <h2>Mahsulotlarni boshqarish</h2>
            <Button type="primary" onClick={() => setShowForm(!showForm)} icon={<PlusOutlined />}>
                {showForm ? 'Formani yopish' : 'Qo\'shish'}
            </Button>
            <div className={`product-form ${showForm ? 'open' : ''} ${formError ? 'shake' : ''}`}>
                <Input name="name" placeholder="Nomi" value={newProduct.name} onChange={handleInputChange} />
                <Input name="description" placeholder="Tavsifi" value={newProduct.description} onChange={handleInputChange} />
                <Input name="purchasePrice" placeholder="Sotib olish narxi" value={newProduct.purchasePrice} onChange={handleInputChange} />
                <Input name="sellingPrice" placeholder="Sotish narxi" value={newProduct.sellingPrice} onChange={handleInputChange} />
                <Input name="quantity" placeholder="Miqdori" value={newProduct.quantity} onChange={handleInputChange} />
                <div className="form-actions">
                    <Button type="primary" onClick={addProduct}>
                        {editMode ? 'Tahrirlashni saqlash' : 'Mahsulot qo\'shish'}
                    </Button>
                    <Button onClick={closeForm} type="default">Formani yopish</Button>
                </div>
            </div>
            <div className="product-table">
                {products.map((product) => (
                    <div key={product._id} className={`product-item ${animateProductId === product._id ? 'animate' : ''}`}>
                        <strong>{product.name}</strong>
                        <p>Narxi: {NumberFormat(product.sellingPrice)} so'm</p>
                        <p>Miqdori: {product.quantity}</p>
                        <div className="AddActions-cart">
                            <Button style={{ background: "green", padding: '0 22px' }} onClick={() => addToProduct(product)} icon={<FaShoppingCart />} type="primary"></Button>
                            <Button onClick={() => editProduct(product)} icon={<EditOutlined />} type="default"></Button>
                            <Button onClick={() => deleteProduct(product._id)} icon={<DeleteOutlined />} type="danger"></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
