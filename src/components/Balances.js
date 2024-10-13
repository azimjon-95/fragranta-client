import React, { useState, useEffect } from 'react';
import axios from '../api';
import { NumberFormat } from '../hooks/NumberFormat';

const Balances = () => {
    const [balances, setBalances] = useState({ cashBalance: 0, creditBalance: 0 });

    useEffect(() => {
        fetchBalances();
    }, []);

    const fetchBalances = async () => {
        try {
            const response = await axios.get('/api/balances');
            console.log(response);
            setBalances(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="balances">
            <h2 style={{ color: "#404040" }}>Balanslar</h2>
            <p>Naqd Pul Balansi:   {NumberFormat(balances.cashBalance)} so'm</p>
            <p>Qarzdorlik Balansi: {NumberFormat(balances.creditBalance)} so'm</p>
        </div>
    );
};

export default Balances;
