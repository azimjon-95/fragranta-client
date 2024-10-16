import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Sales from './components/Sales';
import Balances from './components/Balances';
import Expenses from './components/Expenses';
import './App.css';
import Navbar from './components/navbar.js/Navbar';
import TodoList from './components/TodoList';
import PasscodeScreen from './components/PasscodeScreen';

function App() {
  const navigate = useNavigate();

  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("passcodeSession") === "authenticated"
  );

  // Monitor sessionStorage for changes and update the state
  useEffect(() => {
    const checkAuthStatus = () => {
      const sessionStatus = sessionStorage.getItem("passcodeSession") === "authenticated";
      setIsAuthenticated(sessionStatus);
    };

    window.addEventListener("storage", checkAuthStatus); // Listen for changes in sessionStorage

    return () => {
      window.removeEventListener("storage", checkAuthStatus); // Clean up the event listener
    };
  }, []);

  return (
    <>
      {
        isAuthenticated ? (
          <div className="app-container" >
            <Navbar />
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/balances" element={<Balances />} />
              <Route path="/expenses" element={<Expenses />} />
              {/* If no matching route, redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        ) : (
          <PasscodeScreen setIsAuthenticated={setIsAuthenticated} /> // Pass setIsAuthenticated to update state after passcode entry
        )
      }
    </>
  );
}

export default App;
