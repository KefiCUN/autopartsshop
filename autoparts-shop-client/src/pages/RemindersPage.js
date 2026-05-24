import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({
    customerPhone: '',
    reminderText: '',
    reminderDate: ''
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadReminders(); }, []);

  const loadReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5051/api/Reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(response.data);
    } catch (err) {
      setError('Ошибка загрузки напоминаний');
    }
    setLoading(false);
  };

  const addReminder = async () => {
    if (!newReminder.reminderText || !newReminder.reminderDate) {
      alert('Заполните текст и дату напоминания');
      return;
    }

    try {
      // Сначала ищем клиента по телефону
      let customerId = null;
      if (newReminder.customerPhone) {
        const custResponse = await axios.get(
          `http://localhost:5051/api/Customers/search?term=${newReminder.customerPhone}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (custResponse.data.length > 0) {
          customerId = custResponse.data[0].id;
        }
      }

      await axios.post('http://localhost:5051/api/Reminders', {
        userId: user.id,
        customerId: customerId,
        reminderText: newReminder.reminderText,
        reminderDate: newReminder.reminderDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowAdd(false);
      setNewReminder({ customerPhone: '', reminderText: '', reminderDate: '' });
      loadReminders();
    } catch (err) {
      alert('Ошибка создания напоминания');
    }
  };

  const completeReminder = async (id) => {
    try {
      await axios.put(`http://localhost:5051/api/Reminders/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadReminders();
    } catch (err) {
      alert('Ошибка');
    }
  };

  if (loading) return (
    <div className="text-center" style={{ padding: 80 }}>
      <Spinner animation="border" style={{ color: '#8B0000', width: 48, height: 48 }} />
      <p style={{ marginTop: 16, color: '#888' }}>Загрузка напоминаний...</p>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
        🔔 Напоминания
        <Button onClick={() => setShowAdd(true)} style={{
          float: 'right', background: '#8B0000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600
        }}>
          + Добавить
        </Button>
      </h2>

      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: 16, borderRadius: 12, marginBottom: 20 }}>{error}</div>}

      <Card style={{ borderRadius: 16, border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Card.Body style={{ padding: 0 }}>
          <Table hover style={{ marginBottom: 0 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
                <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Дата</th>
                <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Текст</th>
                <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Клиент</th>
                <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Статус</th>
                <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Действие</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 500 }}>
                    {new Date(r.reminderDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 18px' }}>{r.reminderText}</td>
                  <td style={{ padding: '14px 18px', color: '#888' }}>
                    {r.customerName ? `${r.customerName} (${r.customerPhone})` : '—'}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{
                      background: r.isCompleted ? '#d4edda' : '#fff3cd',
                      color: r.isCompleted ? '#155724' : '#856404',
                      padding: '5px 12px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem'
                    }}>
                      {r.isCompleted ? '✅ Выполнено' : '⏳ Активно'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    {!r.isCompleted && (
                      <Button size="sm" onClick={() => completeReminder(r.id)}
                        style={{ background: '#28a745', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500 }}>
                        ✅ Выполнить
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {reminders.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔔</div>
              <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Напоминаний нет</p>
              <small>Нажмите «+ Добавить» чтобы создать напоминание</small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Модальное окно добавления */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', borderBottom: '3px solid #8B0000' }}>
          <Modal.Title style={{ fontWeight: 700 }}>🔔 Новое напоминание</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Телефон клиента (необязательно)</Form.Label>
            <Form.Control
              placeholder="+79001112233"
              value={newReminder.customerPhone}
              onChange={(e) => setNewReminder({...newReminder, customerPhone: e.target.value})}
              style={{ borderRadius: 10, padding: 10 }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Текст напоминания *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Например: Перезвонить клиенту по поводу заказа"
              value={newReminder.reminderText}
              onChange={(e) => setNewReminder({...newReminder, reminderText: e.target.value})}
              style={{ borderRadius: 10, padding: 10 }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Дата и время *</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newReminder.reminderDate}
              onChange={(e) => setNewReminder({...newReminder, reminderDate: e.target.value})}
              style={{ borderRadius: 10, padding: 10 }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)} style={{ borderRadius: 8 }}>Отмена</Button>
          <Button onClick={addReminder} style={{ background: '#8B0000', border: 'none', borderRadius: 8, fontWeight: 600 }}>💾 Создать</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RemindersPage;