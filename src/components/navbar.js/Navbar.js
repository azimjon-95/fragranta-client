import React from 'react';
import { Link } from 'react-router-dom'; // Link komponentini import qilish
import './style.css';
import logo from '../../assets/FragrantaLogo.png';
import { FaHome, FaShoppingCart, FaMoneyBillWave, FaChartPie } from 'react-icons/fa'; // Ikonalarni import qilish
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { state } = useCart();
    const products = state.cartItems;

    return (
        <div className='navbar'>
            <Link to="/">
                <div className="navLogo">
                    <img src={logo} alt="Fragranta Logo" />
                </div>
            </Link>

            <h1>Fragranta savdo boshqaruvi</h1>

            <div className="navLevs">
                <Link to="/sales">
                    <button>
                        <FaShoppingCart /> <span>Sotuvlar</span>{products?.length > 0 && <p className='products-length'>{products?.length}</p>}
                    </button>
                </Link>
                <Link to="/balances">
                    <button>
                        <FaMoneyBillWave /> <span>Balans</span>
                    </button>
                </Link>
                <Link to="/expenses">
                    <button>
                        <FaChartPie /><span>Xarajatlar</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Navbar;
