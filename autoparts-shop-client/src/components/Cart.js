import React from 'react';
import { Card, Button, ListGroup, Badge } from 'react-bootstrap';

function Cart({ items, onRemoveItem, onClearCart }) {
  const total = items.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card style={{
        borderRadius: 12,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '12px 16px',
          color: 'white',
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: 1
        }}>
          🛒 Корзина
        </div>
        <Card.Body className="text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.3 }}>🛒</div>
          <p style={{ color: '#999', margin: 0, fontWeight: 500 }}>Корзина пуста</p>
          <small style={{ color: '#bbb' }}>Добавьте запчасти из поиска</small>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{
      borderRadius: 12,
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      position: 'sticky',
      top: 20
    }}>
      {/* Заголовок корзины */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '12px 16px',
        color: 'white',
        fontWeight: 600,
        fontSize: '1rem',
        letterSpacing: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>🛒 Корзина</span>
        <Badge style={{
          background: '#8B0000',
          fontSize: '0.8rem',
          padding: '5px 10px',
          borderRadius: 20,
          fontWeight: 600
        }}>
          {items.length} шт.
        </Badge>
      </div>
      
      {/* Список товаров */}
      <ListGroup variant="flush">
        {items.map((item, index) => (
          <ListGroup.Item 
            key={index} 
            style={{
              padding: '14px 16px',
              borderLeft: 'none',
              borderRight: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#fafafa'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1, marginRight: 10 }}>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a',
                  fontSize: '0.9rem',
                  marginBottom: 4
                }}>
                  {item.name}
                </div>
                <div style={{ 
                  color: '#888', 
                  fontSize: '0.8rem',
                  marginBottom: 4
                }}>
                  {item.brand && `${item.brand} • `}{item.quantity} × {item.retailPrice.toFixed(2)} ₽
                </div>
                <div style={{
                  color: '#8B0000',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  = {(item.quantity * item.retailPrice).toFixed(2)} ₽
                </div>
              </div>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                style={{
                  color: '#ccc',
                  padding: '2px 6px',
                  fontSize: '1.1rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#dc3545';
                  e.target.style.transform = 'scale(1.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#ccc';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ✕
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      {/* Итого */}
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: 8
        }}>
          <span style={{ fontWeight: 600, color: '#666', fontSize: '0.95rem' }}>Итого:</span>
          <span style={{ 
            fontWeight: 700, 
            color: '#8B0000', 
            fontSize: '1.2rem',
            letterSpacing: 0.5
          }}>
            {total.toFixed(2)} ₽
          </span>
        </div>
        
        <Button 
          variant="link" 
          size="sm" 
          onClick={onClearCart}
          style={{
            width: '100%',
            color: '#999',
            textDecoration: 'none',
            fontSize: '0.85rem',
            padding: '8px',
            borderRadius: 6,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#dc3545';
            e.target.style.background = 'rgba(220,53,69,0.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#999';
            e.target.style.background = 'transparent';
          }}
        >
          🗑 Очистить корзину
        </Button>
      </div>
    </Card>
  );
}

export default Cart;