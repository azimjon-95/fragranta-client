import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import Sales from './components/Sales';
import Balances from './components/Balances';
import Expenses from './components/Expenses';
import './App.css';
import Navbar from './components/navbar.js/Navbar';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </div>
  );
}

export default App;

