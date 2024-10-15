import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './style.css';
import { Button, message, Tabs, Collapse, Card, Spin, Empty } from 'antd';
import axios from '../api';
import { ShoppingCartOutlined, UserOutlined, PhoneOutlined, CalendarOutlined, MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { NumberFormat } from '../hooks/NumberFormat';

const { TabPane } = Tabs;
const Sales = () => {
    const { state, removeAllFromCart, removeFromCart } = useCart();
    const products = state.cartItems;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [saleInfo, setSaleInfo] = useState({
        saleType: 'cash',
        buyerDetails: {},
        totalAmount: 0,
        totalQuantity: 0,
        quantities: {},
    });

    useEffect(() => {
        calculateTotalAmount();
    }, [saleInfo.quantities, products]);

    const handleSaleInputChange = (e) => {
        setSaleInfo({ ...saleInfo, [e.target.name]: e.target.value });
    };

    const handleBuyerDetailsChange = (e) => {
        setSaleInfo({
            ...saleInfo,
            buyerDetails: { ...saleInfo.buyerDetails, [e.target.name]: e.target.value },
        });
    };

    const calculateTotalAmount = () => {
        let total = 0;
        let totalQuantity = 0;

        products?.forEach((product) => {
            const quantity = saleInfo.quantities[product._id] || product.quantity;
            const price = Number(product.sellingPrice);

            total += price * quantity;
            totalQuantity += quantity;
        });

        setSaleInfo((prev) => ({ ...prev, totalAmount: total, totalQuantity }));
    };

    const submitSale = async () => {
        try {
            const capacity = {
                saleType: saleInfo.saleType,
                buyerDetails: {
                    fullName: saleInfo.buyerDetails.fullName,
                    phone: saleInfo.buyerDetails.phone,
                },
                totalAmount: saleInfo.totalAmount,
                totalQuantity: saleInfo.totalQuantity,
                quantities: saleInfo.quantities,
                products: products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    price: Number(product.purchasePrice),
                    sellPrice: Number(product.sellingPrice),
                    quantity: saleInfo.quantities[product._id] || product.quantity,
                    total: Number(product.sellingPrice) * product.quantity,
                })),
            };

            await axios.post('/api/sales', capacity);
            message.success('Sotuv muvaffaqiyatli amalga oshirildi!');

            setSaleInfo({ saleType: 'cash', buyerDetails: {}, totalAmount: 0, totalQuantity: 0, quantities: {} });
            removeAllFromCart()
        } catch (error) {
            console.error('Sotish vaqtida xatolik:', error);
        }
    };

    const handleQuantityChange = (productId, change) => {
        setSaleInfo((prev) => {
            const newQuantities = { ...prev.quantities };
            newQuantities[productId] = (newQuantities[productId] || 0) + change;

            if (newQuantities[productId] < 1) {
                delete newQuantities[productId];
            }

            return { ...prev, quantities: newQuantities };
        });
    };

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
        setSaleInfo((prev) => {
            const newQuantities = { ...prev.quantities };
            delete newQuantities[productId];
            return { ...prev, quantities: newQuantities };
        });
    };

    useEffect(() => {
        const getHistory = async () => {
            try {
                const result = await axios.get('/api/sales');
                setData(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, []);

    if (loading) return <div className="loading-spinner">
        <Spin size="large" />
    </div>;
    if (error) return <div className="loading-spinner">
        Xatolik: {error}
    </div>;

    const filteredSales = (type) => data.filter(sale => sale.saleType === type);
    const formatDate = (date) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24 soat formatida
        };

        return new Date(date).toLocaleString('uz-UZ', options).replace(',', ''); // O'zbekistonga moslash
    };

    // Funksiya to'lovni amalga oshirish uchun
    const handleUpdate = async (sale) => {
        const cashBalance = sale.totalAmount; // Naqd mablag'
        sale.saleType = "cash"; // Sotuv turini "naqd" ga o'zgartirish

        try {
            // Balansni yangilash
            await axios.post('/api/balances/update', { cashBalance });

            // Sotuv ma'lumotlarini yangilash
            await axios.put(`/api/sales/${sale._id}`, sale);

            // Muvaffaqiyatli yangilash haqida xabar
            message.success("Qarzdorlik muvaffaqiyatli To'landi!");
        } catch (error) {
            console.error('Balansni yangilashda xatolik:', error.response?.data || error.message);
            message.error('Balansni yangilashda xatolik yuz berdi!'); // Xatolik haqida xabar
        }
    };
    console.log(data);
    return (
        <>
            {
                products?.length > 0 &&
                <div className="sales-section-cart">
                    <div className="product-table-cart">
                        {products?.map((product) => {
                            const quantity = saleInfo.quantities[product._id] || product.quantity || 0;
                            const price = Number(product.sellingPrice) || 0;
                            const totalPrice = price * quantity;

                            return (
                                <div key={product._id} className="product-item-cart">
                                    <div className="product-info">
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-price">{NumberFormat(product.sellingPrice)} so'm</p> |
                                        <p className="product-quantity">x{quantity}</p> |
                                        <p className="product-total">{NumberFormat(totalPrice)} so'm</p>
                                    </div>
                                    <div className="AddActions">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<MinusOutlined />}
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                        />
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<PlusOutlined />}
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                        />
                                        |
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveFromCart(product._id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="sale-inputs">
                        <div className="info-cart">
                            <p>Jami: <strong>{NumberFormat(saleInfo.totalAmount)} so'm</strong></p>
                            <p>Miqdor: <strong>{saleInfo.totalQuantity} ta</strong></p>
                        </div>

                        <div className="input-group">
                            <select name="saleType" onChange={handleSaleInputChange} value={saleInfo.saleType}>
                                <option value="cash">Naqdga</option>
                                <option value="credit">Nasiyaga</option>
                            </select>
                        </div>

                        {saleInfo.saleType === 'credit' && (
                            <div className="buyer-info">
                                <input name="fullName" placeholder="Xaridor Ismi Familiyasi" onChange={handleBuyerDetailsChange} />
                                <input name="phone" placeholder="Xaridor Telefon" onChange={handleBuyerDetailsChange} />
                            </div>
                        )}

                        <Button type="primary" onClick={submitSale}>Sotuvni yuborish</Button>
                    </div>
                </div>
            }

            {/* Sotuvlar tarixini ko'rsatish */}
            <div className="sales-history">
                <h3 style={{ textAlign: "center", color: "#fff" }}>Sotuvlar Tarixi</h3>
                {data?.length > 0 ? (
                    // saleType bo'yicha filtrlangan sotuvlar
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Nasiyaga" key="credit">
                            {filteredSales('credit').map((sale) => (
                                <div key={sale._id} className="sale-item">
                                    {
                                        sale?.buyerDetails?.fullName &&
                                        <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <UserOutlined />
                                            <strong>Xaridor:</strong> {sale?.buyerDetails?.fullName}
                                        </p>
                                    }
                                    {
                                        sale?.buyerDetails?.phone &&
                                        <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <PhoneOutlined />
                                            <strong>Tel:</strong> {sale?.buyerDetails?.phone}
                                        </p>
                                    }
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <ShoppingCartOutlined />
                                        <strong>Jami:</strong> {NumberFormat(sale.totalAmount)} so'm
                                    </p>
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <CalendarOutlined />
                                        <strong>Sotuv sanasi:</strong> {formatDate(sale.date)}
                                    </p>
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <strong>Miqdor:</strong> {sale.totalQuantity} ta
                                    </p>

                                    {/* Collapse component to show products */}

                                    <Button onClick={() => handleUpdate(sale)} type="primary" style={{ margin: " 5px 0", width: "100%" }}>
                                        To'lash
                                    </Button>
                                    <Collapse Collapse >
                                        <Collapse.Panel header="Mahsulotlar" key="1">
                                            {sale.products.map((product) => (
                                                <Card
                                                    key={product.id}
                                                    style={{
                                                        margin: "10px 0",
                                                        borderRadius: "8px",
                                                        border: "1px solid #e0e0e0",
                                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                >
                                                    {/* <div > */}
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Nomi:<span style={{ marginLeft: "8px", fontSize: "16px" }}>{product.name}</span></strong>
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Miqdor: <span style={{ marginLeft: "8px", fontSize: "16px" }}>{product.quantity} ta</span></strong>
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Narx: <span style={{ marginLeft: "8px", fontSize: "16px", color: "#4caf50" }}>
                                                        {NumberFormat(product.price)} so'm
                                                    </span></strong>

                                                    {/* </div> */}
                                                </Card>
                                            ))}
                                        </Collapse.Panel>
                                    </Collapse>


                                </div>
                            ))}
                        </TabPane>
                        <TabPane tab="Naqdga" key="cash">
                            {filteredSales('cash').map((sale) => (
                                <div key={sale._id} className="sale-item">
                                    {
                                        sale?.buyerDetails?.fullName &&
                                        <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <UserOutlined />
                                            <strong>Xaridor:</strong> {sale?.buyerDetails?.fullName}
                                        </p>
                                    }
                                    {
                                        sale?.buyerDetails?.phone &&
                                        <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <PhoneOutlined />
                                            <strong>Tel:</strong> {sale?.buyerDetails?.phone}
                                        </p>
                                    }
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <ShoppingCartOutlined />
                                        <strong>Jami:</strong> {NumberFormat(sale.totalAmount)} so'm
                                    </p>
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <CalendarOutlined />
                                        <strong>Sotuv sanasi:</strong> {formatDate(sale.date)}
                                    </p>
                                    <p style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <strong>Miqdor:</strong> {sale.totalQuantity} ta
                                    </p>
                                    {/* Collapse component to show products */}
                                    <Collapse Collapse >
                                        <Collapse.Panel header="Mahsulotlar" key="1">
                                            {sale.products.map((product) => (
                                                <Card
                                                    key={product.id}
                                                    style={{
                                                        margin: "10px 0",
                                                        borderRadius: "8px",
                                                        border: "1px solid #e0e0e0",
                                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                >
                                                    {/* <div > */}
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Nomi:<span style={{ marginLeft: "8px", fontSize: "16px" }}>{product.name}</span></strong><br />
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Narx: <span style={{ marginLeft: "8px", fontSize: "16px", color: "#4caf50" }}> {NumberFormat(product.sellPrice)} so'm </span></strong><br />
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Miqdor: <span style={{ marginLeft: "8px", fontSize: "16px" }}>{product.quantity} ta</span></strong><br />
                                                    <strong style={{ fontSize: "16px", color: "#333" }}>Jammi: <span style={{ marginLeft: "8px", fontSize: "16px", color: "#4caf50" }}> {NumberFormat(product.total)} so'm </span></strong>
                                                    {/* </div> */}
                                                </Card>
                                            ))}
                                        </Collapse.Panel>
                                    </Collapse>
                                </div >
                            ))}
                        </TabPane >
                    </Tabs >
                ) : (
                    <Empty description="Sotuvlar mavjud emas." />
                )}
            </div >
        </>
    );
};

export default Sales;
