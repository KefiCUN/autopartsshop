import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import NavigationBar from './components/Navbar';
import Cart from './components/Cart';
import PartsSearch from './pages/PartsSearch';
import Checkout from './pages/Checkout';
import OrdersList from './pages/OrdersList';
import CustomerCard from './pages/CustomerCard';
import StockPage from './pages/StockPage';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RemindersPage from './pages/RemindersPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('search');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState('');

  // Проверка низких остатков при загрузке
  useEffect(() => {
    checkLowStock();
  }, []);

  const checkLowStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5051/api/Parts/lowstock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length > 0) {
        setLowStockAlert(`⚠️ Внимание! ${response.data.length} запчастей с низким остатком: ${response.data.map(p => p.name).join(', ')}`);
      }
    } catch (err) {
      // Ничего не делаем
    }
  };

  const addToCart = (part) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === part.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...part, quantity: 1 }];
    });
  };

  const removeFromCart = (partId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== partId));
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderSuccess('');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <PartsSearch onAddToCart={addToCart} />;
      case 'checkout':
        return (
          <div>
            <Button variant="outline-secondary" onClick={() => setCurrentPage('search')} className="mb-3">
              ← Назад к поиску
            </Button>
            <Checkout 
              cartItems={cartItems} 
              onClearCart={() => {
                clearCart();
                setOrderSuccess('✅ Заказ успешно создан!');
                setCurrentPage('search');
              }} 
            />
          </div>
        );
      case 'orders':
        return <OrdersList />;
      case 'customers':
        return <CustomerCard />;
      case 'stock':
        return <StockPage />;
      case 'reminders':
        return <RemindersPage />;
      default:
        return <PartsSearch onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="App">
      <NavigationBar 
        cartCount={cartItems.length} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      <Container fluid className="main-content">
        {/* Уведомление о низких остатках */}
        {lowStockAlert && (
          <div className="alert alert-warning alert-dismissible fade show">
            {lowStockAlert}
            <button type="button" className="btn-close" onClick={() => setLowStockAlert('')}></button>
          </div>
        )}
        
        {/* Уведомление об успешном заказе */}
        {orderSuccess && (
          <div className="alert alert-success alert-dismissible fade show">
            {orderSuccess}
            <button type="button" className="btn-close" onClick={() => setOrderSuccess('')}></button>
          </div>
        )}
        
        <Row>
          <Col md={currentPage === 'search' ? 9 : 12}>
            {renderPage()}
          </Col>
          
          {currentPage === 'search' && (
            <Col md={3}>
              <Cart 
                items={cartItems}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
              />
              {cartItems.length > 0 && (
                <button 
                  className="btn btn-success w-100 mt-2"
                  onClick={() => setCurrentPage('checkout')}
                >
                  📝 Оформить заказ
                </button>
              )}
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;