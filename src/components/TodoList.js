// src/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from '../api';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './style.css';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editId, setEditId] = useState(null);

    // Todosni olish
    const fetchTodos = async () => {
        const response = await axios.get('/api/todos');
        setTodos(response?.data);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Todo yaratish yoki yangilash
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await axios.put(`/api/todos/${editId}`, { text });
            setEditId(null);
        } else {
            await axios.post('/api/todos', { text });
        }
        setText('');
        fetchTodos(); // To'g'ri joyda chaqirildi
    };

    // Todo o'chirish
    const handleDelete = async (id) => {
        await axios.delete(`/api/todos/${id}`);
        fetchTodos(); // To'g'ri joyda chaqirildi
    };

    // Todo tahrirlash
    const handleEdit = (todo) => {
        setText(todo?.text);
        setEditId(todo?._id);
    };

    return (
        <div className="container-todo">
            <h1>Tovarlar Ro'yxati</h1>
            <ul>
                {todos?.map((todo, inx) => (
                    <motion.li
                        key={inx}
                        initial={{ opacity: 0, translateY: 20 }} // Pastdan yuqoriga harakat boshlanadi
                        animate={{ opacity: 1, translateY: 0 }} // O'zgarmas holat
                        exit={{ opacity: 0, translateY: -20 }} // Yuqoriga chiqib ketadi
                    >
                        {inx + 1})  {todo.text}
                        <div style={{ display: "flex", gap: "5px" }}>
                            <button
                                className="edit-button"
                                onClick={() => handleEdit(todo)}
                            >
                                <FaEdit className="icon" />
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(todo._id)}
                            >
                                <FaTrash className="icon" />
                            </button>
                        </div>
                    </motion.li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Yangi to-do qo'shish..."
                    required
                />
                <button type="submit" className="add-button">
                    {editId ? 'Yangilash' : 'Qo\'shish'}
                </button>
            </form>
            <br />
            <hr />
            <p className="description">
                Tovarlar ro'yxati - bu sizning mahsulotlaringizni boshqarish va kuzatishga yordam beruvchi qulay vosita. Ushbu ilova orqali siz yangi tovarlarni qo'shishingiz, mavjud tovarlarni tahrirlashingiz va o'chirishingiz mumkin.
                Mahsulotlar ro'yxatini yaratish, ularni tasniflash va zaruriy ma'lumotlar bilan to'ldirish orqali ish jarayonini yanada samarali qiladi.
                Har bir tovar uchun batafsil ma'lumot qo'shish imkoniyati sizga tovarlarni tezda topish va kerakli o'zgarishlarni kiritishga yordam beradi.
            </p>
        </div>
    );
};

export default TodoList;
