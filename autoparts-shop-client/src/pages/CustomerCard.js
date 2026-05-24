import React, { useState } from 'react';
import { Card, Button, Form, Alert, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

function CustomerCard() {
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddCall, setShowAddCall] = useState(false);
  const [newCall, setNewCall] = useState({ type: 'Call', topic: '', result: '', notes: '' });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = 'http://localhost:5051/api';

  const searchCustomer = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setOrders([]);
    setInteractions([]);
    
    try {
      const response = await axios.get(`${API_URL}/Customers/search?term=${phone}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.length > 0) {
        const foundCustomer = response.data[0];
        setCustomer(foundCustomer);
        loadCustomerOrders(foundCustomer.id);
        loadCustomerInteractions(foundCustomer.id);
      } else {
        setCustomer(null);
        setError('Клиент не найден');
      }
    } catch (err) {
      setError('Ошибка поиска');
    }
    setLoading(false);
  };

  const loadCustomerOrders = async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/Orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.filter(o => o.customerName === customer?.fullName));
    } catch (err) {
      console.error('Ошибка загрузки заказов');
    }
  };

  const loadCustomerInteractions = async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/Customers/${customerId}/interactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInteractions(response.data);
    } catch (err) {
      console.error('Ошибка загрузки взаимодействий');
    }
  };

  const addInteraction = async () => {
    if (!customer) return;
    
    try {
      await axios.post(`${API_URL}/Customers/${customer.id}/interactions`, {
        userId: user.id,
        type: newCall.type,
        topic: newCall.topic,
        result: newCall.result,
        notes: newCall.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowAddCall(false);
      setNewCall({ type: 'Call', topic: '', result: '', notes: '' });
      loadCustomerInteractions(customer.id);
    } catch (err) {
      alert('Ошибка добавления звонка');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <Badge bg="primary">Новый</Badge>;
      case 'Paid': return <Badge bg="success">Оплачен</Badge>;
      case 'Shipped': return <Badge bg="info">Отгружен</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Call': return '📞';
      case 'Order': return '🛒';
      case 'Consultation': return '💬';
      case 'Complaint': return '😠';
      default: return '📝';
    }
  };

  return (
    <div>
      <h2 className="mb-4">👤 Карточка клиента</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Поиск по телефону</Form.Label>
            <div className="d-flex">
              <Form.Control
                placeholder="Введите телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
              />
              <Button variant="primary" onClick={searchCustomer} disabled={loading} className="ms-2">
                🔍 Найти
              </Button>
            </div>
          </Form.Group>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {customer && (
        <>
          <Card className="mb-4 border-primary">
            <Card.Header className="bg-primary text-white">
              <strong>👤 {customer.fullName}</strong>
            </Card.Header>
            <Card.Body>
              <p>📞 {customer.phone}</p>
              <p>📧 {customer.email || 'Не указан'}</p>
              <p>🚗 {customer.carModel || 'Не указан'} {customer.carYear || ''}</p>
              <p>Всего заказов: <strong>{orders.length}</strong></p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>📝 История взаимодействий</strong>
              <Button variant="primary" size="sm" onClick={() => setShowAddCall(!showAddCall)}>
                + Добавить звонок
              </Button>
            </Card.Header>
            <Card.Body>
              {showAddCall && (
                <Card className="mb-3 bg-light">
                  <Card.Body>
                    <Form.Select 
                      className="mb-2"
                      value={newCall.type}
                      onChange={(e) => setNewCall({...newCall, type: e.target.value})}
                    >
                      <option value="Call">📞 Звонок</option>
                      <option value="Consultation">💬 Консультация</option>
                      <option value="Order">🛒 Заказ</option>
                      <option value="Complaint">😠 Жалоба</option>
                    </Form.Select>
                    <Form.Control 
                      placeholder="Тема" 
                      className="mb-2"
                      value={newCall.topic}
                      onChange={(e) => setNewCall({...newCall, topic: e.target.value})}
                    />
                    <Form.Control 
                      placeholder="Результат" 
                      className="mb-2"
                      value={newCall.result}
                      onChange={(e) => setNewCall({...newCall, result: e.target.value})}
                    />
                    <Form.Control 
                      as="textarea" 
                      placeholder="Комментарий" 
                      className="mb-2"
                      value={newCall.notes}
                      onChange={(e) => setNewCall({...newCall, notes: e.target.value})}
                    />
                    <Button variant="success" size="sm" onClick={addInteraction}>💾 Сохранить</Button>
                  </Card.Body>
                </Card>
              )}
              
              {interactions.length > 0 ? (
                interactions.map(inter => (
                  <div key={inter.id} className="border-bottom py-2">
                    <div>
                      <strong>{getTypeBadge(inter.type)} {inter.topic || inter.type}</strong>
                      <small className="text-muted ms-2">
                        {new Date(inter.interactionDate).toLocaleString('ru-RU')}
                      </small>
                    </div>
                    {inter.result && <div>Результат: {inter.result}</div>}
                    {inter.notes && <div className="text-muted">{inter.notes}</div>}
                    <small className="text-muted">Менеджер: {inter.userName}</small>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-3">
                  Нет записей о взаимодействиях
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header><strong>📋 История заказов</strong></Card.Header>
            <Card.Body>
              {orders.length > 0 ? (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Номер</th>
                      <th>Дата</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.orderNumber}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</td>
                        <td>{order.totalAmount.toFixed(2)} ₽</td>
                        <td>{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-3">Заказов пока нет</div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}

export default CustomerCard;