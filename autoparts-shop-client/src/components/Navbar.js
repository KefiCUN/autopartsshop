import React from 'react';
import { Navbar as BNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function NavigationBar({ cartCount = 0, onNavigate, currentPage }) {
  const { user, logout } = useAuth();

  return (
    <BNavbar expand="lg" sticky="top" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderBottom: '3px solid #8B0000',
      boxShadow: '0 2px 15px rgba(0,0,0,0.5)',
      padding: '8px 0'
    }}>
      <Container>
        {/* Логотип */}
        <BNavbar.Brand 
          style={{ cursor: 'pointer' }} 
          onClick={() => onNavigate && onNavigate('search')}
          className="d-flex align-items-center"
        >
          <div style={{
            width: 42,
            height: 42,
            background: 'white',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <img 
              src="favicon.ico" 
              alt="AutoParts" 
              style={{ 
                width: 34, 
                height: 34, 
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size:1.4rem">🚗</span>';
              }}
            />
          </div>
          <span style={{
            color: 'white',
            fontWeight: 700,
            fontSize: '1.3rem',
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            AutoParts
          </span>
        </BNavbar.Brand>
        
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-3">
            <Nav.Link 
              active={currentPage === 'search'}
              onClick={() => onNavigate && onNavigate('search')}
              style={{
                color: currentPage === 'search' ? 'white' : 'rgba(255,255,255,0.7)',
                background: currentPage === 'search' ? '#8B0000' : 'transparent',
                borderRadius: 8,
                padding: '8px 16px',
                margin: '0 4px',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'search') {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'search') {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <span style={{ marginRight: 6 }}>🔍</span>
              Поиск
            </Nav.Link>
            
            <Nav.Link 
              active={currentPage === 'orders'}
              onClick={() => onNavigate && onNavigate('orders')}
              style={{
                color: currentPage === 'orders' ? 'white' : 'rgba(255,255,255,0.7)',
                background: currentPage === 'orders' ? '#8B0000' : 'transparent',
                borderRadius: 8,
                padding: '8px 16px',
                margin: '0 4px',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'orders') {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'orders') {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <span style={{ marginRight: 6 }}>📋</span>
              Заказы
            </Nav.Link>
            
            <Nav.Link 
              active={currentPage === 'customers'}
              onClick={() => onNavigate && onNavigate('customers')}
              style={{
                color: currentPage === 'customers' ? 'white' : 'rgba(255,255,255,0.7)',
                background: currentPage === 'customers' ? '#8B0000' : 'transparent',
                borderRadius: 8,
                padding: '8px 16px',
                margin: '0 4px',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'customers') {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'customers') {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <span style={{ marginRight: 6 }}>👥</span>
              Клиенты
            </Nav.Link>
            {user?.role === 'Admin' && (
              <Nav.Link active={currentPage === 'stock'} onClick={() => onNavigate && onNavigate('stock')}>📦 Склад</Nav.Link>
            )}
            <Nav.Link active={currentPage === 'reminders'} onClick={() => onNavigate && onNavigate('reminders')}>
              <span style={{ marginRight: 6 }}>🔔</span>
              Напоминания
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {/* Информация о пользователе */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '6px 14px',
              marginRight: 12,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '0.85rem',
                lineHeight: 1.2
              }}>
                {user?.fullName}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                {user?.role}
              </div>
            </div>
            
            {/* Кнопка выхода */}
            <Nav.Link 
              onClick={logout} 
              style={{
                color: '#ff6b6b',
                fontWeight: 600,
                borderRadius: 8,
                padding: '8px 14px',
                transition: 'all 0.3s ease',
                border: '1px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,107,107,0.15)';
                e.target.style.borderColor = 'rgba(255,107,107,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'transparent';
              }}
            >
              Выйти
            </Nav.Link>
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}

export default NavigationBar;