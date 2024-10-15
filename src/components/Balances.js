import React, { useState, useEffect } from 'react';
import axios from '../api';
import { NumberFormat } from '../hooks/NumberFormat';
import { DollarCircleOutlined, ArrowUpOutlined, CreditCardOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

const Balances = () => {
    const [balances, setBalances] = useState({ cashBalance: 0, creditBalance: 0 });
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [profit, setProfit] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchBalances();
    }, []);

    const fetchBalances = async () => {
        try {
            // Using Promise.all to execute multiple requests concurrently
            const [balancesResponse, purchaseResponse, profitResponse] = await Promise.all([
                axios.get('/api/balances'),
                axios.get('/api/products/total-purchase-price'),
                axios.get('/api/sales/totalProfit')
            ]);

            // Setting the state with the responses
            setBalances(balancesResponse.data);
            setPurchasePrice(purchaseResponse.data.totalPurchasePrice);
            setProfit(profitResponse.data);
        } catch (error) {
            console.error('Error fetching balances:', error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    if (loading) {
        // Show a loading spinner while fetching data
        return (
            <div className="balance-box">
                <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
            </div>
        );
    }

    return (
        <div className="balance-box">
            <div className="balances">
                <Title level={2} className="balances-title">Balanslar</Title>

                <Card className="balance-card" hoverable>
                    <div className="balance-item">
                        <DollarCircleOutlined className="balance-icon" />
                        <Text>Balansi: {NumberFormat(balances?.cashBalance)} so'm</Text>
                    </div>
                </Card>

                <Card className="balance-card" hoverable>
                    <div className="balance-item">
                        <ArrowUpOutlined className="balance-icon" />
                        <Text>Sof foyda: {NumberFormat(profit)} so'm</Text>
                    </div>
                </Card>

                <Card className="balance-card" hoverable>
                    <div className="balance-item">
                        <CreditCardOutlined className="balance-icon" />
                        <Text>Qarzdorlik Balansi: {NumberFormat(balances?.creditBalance)} so'm</Text>
                    </div>
                </Card>

                <Card className="balance-card" hoverable>
                    <div className="balance-item">
                        <ShoppingCartOutlined className="balance-icon" />
                        <Text>Mavjud tavarlarning jami narxi: {NumberFormat(purchasePrice)} so'm</Text>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Balances;
