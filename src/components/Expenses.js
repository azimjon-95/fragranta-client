import React, { useState, useEffect } from 'react';
import axios from '../api';
import { message, notification } from 'antd';
import moment from 'moment'; // Moment kutubxonasini import qilish
import './style.css'
import { NumberFormat } from '../hooks/NumberFormat';


const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('/api/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExpenseInputChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    };

    const addExpense = async () => {
        try {
            // Xarajat ma'lumotlarini to'g'ridan-to'g'ri yuborish
            await axios.post('/api/expenses', newExpense);

            // Xarajatlarni qayta olish (ma'lumotlar yangilanishi uchun)
            fetchExpenses();

            // Inputlarni tozalash
            setNewExpense({ description: '', amount: '' });

            // Muvaffaqiyatli xabar chiqarish
            message.success("Xarajat muvaffaqiyatli qo'shildi");
        }
        catch (error) {
            // Handle the error response from the server
            if (error.response && error.response.status === 400) {
                notification.error({
                    message: 'Xato!',
                    description: error.response.data.message,  // "Balans yetarli emas"
                });
            } else {
                notification.error({
                    message: 'Xato!',
                    description: 'Xarajat qo\'shishda muammo yuz berdi',
                });
            }
        }
    }


    return (
        <div className="expenses-section">
            <h2>Xarajatlar</h2>
            <input
                name="description"
                placeholder="Tavsif"
                value={newExpense.description} // Inputning qiymatini set qilish
                onChange={handleExpenseInputChange}
            />
            <input
                name="amount"
                placeholder="Miqdori"
                value={newExpense.amount} // Inputning qiymatini set qilish
                onChange={handleExpenseInputChange}
            />
            <button onClick={addExpense}>Xarajat qo'shish</button>

            <div className="expense-list" style={{ marginTop: '20px' }}>
                {expenses.map((expense) => (
                    <div
                        key={expense._id}
                        style={{
                            backgroundColor: '#f9f9f9',
                            padding: '15px',
                            borderRadius: '0 8px 8px 8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '30px',
                            position: "relative"
                        }}
                    >
                        <p style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#333',
                            margin: '0 0 10px'
                        }}>
                            <strong>Tavsif:</strong> {expense.description}
                        </p>
                        <p style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#4caf50',
                            margin: '0'
                        }}>
                            <strong>Miqdori:</strong> {NumberFormat(expense.amount)} so'm
                        </p>
                        <p className="date-expense">
                            {moment(expense.date).format("DD.MM.YYYY")}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Expenses;
