import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Sales from './components/Sales';
import Balances from './components/Balances';
import Expenses from './components/Expenses';
import './App.css';
import Navbar from './components/navbar.js/Navbar';
import TodoList from './components/TodoList';
import PasscodeScreen from './components/PasscodeScreen';

function App() {
  // Avtorizatsiya holatini tekshirish
  const isAuthenticated = sessionStorage.getItem("authenticated") === "true";

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <PasscodeScreen /> // Agar avtorizatsiya qilinmagan bo'lsa, PasscodeScreen ko'rsatiladi
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/balances" element={<Balances />} />
            <Route path="/expenses" element={<Expenses />} />
            {/* Agar sahifalar mavjud bo'lmasa, 404 sahifaga yo'naltirish */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
