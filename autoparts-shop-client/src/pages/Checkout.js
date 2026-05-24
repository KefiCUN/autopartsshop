import React, { useState } from 'react';
import { Card, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function Checkout({ cartItems, onClearCart }) {
  const [phone, setPhone] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '', carModel: '' });
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5051/api';
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const searchCustomers = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/Customers/search?term=${encodeURIComponent(phone)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
      if (response.data.length === 0) setError('Клиенты не найдены');
    } catch (err) {
      setError('Ошибка поиска клиентов');
    }
    setLoading(false);
  };

  const createCustomer = async () => {
    if (!newCustomer.fullName || !newCustomer.phone) {
      setError('Имя и телефон обязательны');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/Customers`, newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCustomer(response.data);
      setShowNewCustomer(false);
      setMessage('Клиент создан');
    } catch (err) {
      setError('Ошибка создания клиента');
    }
    setLoading(false);
  };

  const createOrder = async () => {
    if (!selectedCustomer) { setError('Выберите клиента'); return; }
    if (cartItems.length === 0) { setError('Корзина пуста'); return; }

    setLoading(true);
    setError('');
    try {
      const orderData = {
        customerId: selectedCustomer.id,
        userId: user.id,
        items: cartItems.map(item => ({ partId: item.id, quantity: item.quantity })),
        notes: ''
      };

      const response = await axios.post(`${API_URL}/Orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(`Заказ ${response.data.order.orderNumber} создан! Сумма: ${response.data.order.totalAmount} ₽`);
      onClearCart();
      setSelectedCustomer(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания заказа');
    }
    setLoading(false);
  };

  const total = cartItems.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
        <span style={{ marginRight: 10 }}>🛒</span>
        Оформление заказа
      </h2>

      {message && <Alert style={{ background: '#d4edda', color: '#155724', borderRadius: 12, border: 'none' }}>{message}</Alert>}
      {error && <Alert style={{ background: '#f8d7da', color: '#721c24', borderRadius: 12, border: 'none' }}>{error}</Alert>}

      {/* Товары */}
      <Card style={{ borderRadius: 14, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '14px 18px', color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>
          📦 Товары в заказе
        </div>
        <ListGroup variant="flush">
          {cartItems.map((item, i) => (
            <ListGroup.Item key={i} style={{ padding: '14px 18px', fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <span style={{ color: '#888' }}> | {item.brand} | </span>
              <span>{item.quantity} шт. × {item.retailPrice} ₽</span>
              <span style={{ float: 'right', fontWeight: 700, color: '#8B0000' }}>
                = {(item.quantity * item.retailPrice).toFixed(2)} ₽
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div style={{ padding: '16px 18px', background: '#f9f9f9', textAlign: 'right' }}>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1a1a1a' }}>
            Итого: <span style={{ color: '#8B0000' }}>{total.toFixed(2)} ₽</span>
          </span>
        </div>
      </Card>

      {/* Поиск клиента */}
      {!selectedCustomer ? (
        <Card style={{ borderRadius: 14, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '14px 18px', color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>
            👤 Поиск клиента по телефону
          </div>
          <div style={{ padding: 18 }}>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Введите номер телефона (например +79011234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
                style={{ borderRadius: 10, padding: 12, border: '2px solid #e0e0e0' }}
              />
            </Form.Group>
            <Button 
              onClick={searchCustomers} 
              disabled={loading}
              style={{
                borderRadius: 10, padding: '10px 20px', fontWeight: 600,
                background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
                border: 'none', boxShadow: '0 3px 10px rgba(139,0,0,0.3)'
              }}
            >
              🔍 Найти
            </Button>
            <Button 
              variant="link" 
              onClick={() => setShowNewCustomer(!showNewCustomer)}
              style={{ color: '#8B0000', fontWeight: 500, textDecoration: 'none' }}
            >
              + Новый клиент
            </Button>

            {customers.length > 0 && (
              <ListGroup className="mt-3">
                {customers.map(c => (
                  <ListGroup.Item 
                    key={c.id} 
                    action 
                    onClick={() => { setSelectedCustomer(c); setError(''); }}
                    style={{ borderRadius: 10, marginBottom: 4, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <strong style={{ color: '#1a1a1a' }}>{c.fullName}</strong>
                    <span style={{ color: '#888' }}> | 📞 {c.phone}</span>
                    <span style={{ color: '#888' }}> | 🚗 {c.carModel || 'Не указано'}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Card>
      ) : (
        <Card style={{ borderRadius: 14, border: '2px solid #28a745', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: '#28a745', padding: '14px 18px', color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✅ Клиент выбран</span>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={() => setSelectedCustomer(null)}
              style={{ borderRadius: 8 }}
            >
              Изменить
            </Button>
          </div>
          <div style={{ padding: 18 }}>
            <h5 style={{ fontWeight: 700, color: '#1a1a1a' }}>{selectedCustomer.fullName}</h5>
            <p style={{ margin: '4px 0', color: '#666' }}>📞 {selectedCustomer.phone}</p>
            <p style={{ margin: 0, color: '#666' }}>🚗 {selectedCustomer.carModel || 'Не указано'} {selectedCustomer.carYear || ''}</p>
          </div>
        </Card>
      )}

      {/* Новый клиент */}
      {showNewCustomer && (
        <Card style={{ borderRadius: 14, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '14px 18px', color: 'white', fontWeight: 600 }}>
            🆕 Новый клиент
          </div>
          <div style={{ padding: 18 }}>
            <Form.Control 
              placeholder="Имя *" 
              className="mb-2"
              value={newCustomer.fullName}
              onChange={(e) => setNewCustomer({...newCustomer, fullName: e.target.value})} 
              style={{ borderRadius: 10, padding: 10 }}
            />
            <Form.Control 
              placeholder="Телефон *" 
              className="mb-2"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} 
              style={{ borderRadius: 10, padding: 10 }}
            />
            <Form.Control 
              placeholder="Автомобиль" 
              className="mb-2"
              value={newCustomer.carModel}
              onChange={(e) => setNewCustomer({...newCustomer, carModel: e.target.value})} 
              style={{ borderRadius: 10, padding: 10 }}
            />
            <Button 
              onClick={createCustomer} 
              disabled={loading}
              style={{
                borderRadius: 10, padding: '10px 20px', fontWeight: 600,
                background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                border: 'none', boxShadow: '0 3px 10px rgba(40,167,69,0.3)'
              }}
            >
              ✅ Создать клиента
            </Button>
          </div>
        </Card>
      )}

      <Button 
        size="lg" 
        onClick={createOrder} 
        disabled={loading || !selectedCustomer || cartItems.length === 0} 
        style={{
          width: '100%', padding: 16, borderRadius: 12, fontWeight: 700, fontSize: '1.1rem',
          background: loading ? '#aaa' : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
          border: 'none', boxShadow: loading ? 'none' : '0 4px 15px rgba(40,167,69,0.4)',
          letterSpacing: 1, transition: 'all 0.3s ease'
        }}
      >
        {loading ? '⏳ Создание...' : '✅ Оформить заказ'}
      </Button>
    </div>
  );
}

export default Checkout;