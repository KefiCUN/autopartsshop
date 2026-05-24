import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

function StockPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadParts(); }, []);

  const loadParts = async () => {
    try {
      const response = await axios.get('http://localhost:5051/api/Parts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParts(response.data);
    } catch (err) {
      setError('Ошибка загрузки склада');
    }
    setLoading(false);
  };

  const openEdit = (part) => {
    setEditingPart(part);
    setEditStock(part.stockQuantity);
    setEditPrice(part.retailPrice);
    setShowEdit(true);
  };

  const saveStock = async () => {
    try {
      await axios.put(`http://localhost:5051/api/Parts/${editingPart.id}/stock`,
        { stockQuantity: parseInt(editStock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEdit(false);
      loadParts();
    } catch (err) {
      alert('Ошибка сохранения остатка');
    }
  };

  const savePrice = async () => {
    try {
      await axios.put(`http://localhost:5051/api/Parts/${editingPart.id}/price`,
        { retailPrice: parseFloat(editPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEdit(false);
      loadParts();
    } catch (err) {
      alert('Ошибка сохранения цены');
    }
  };

  if (user.role !== 'Admin') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h4>Доступ запрещен</h4>
        <p style={{ color: '#888' }}>Только для администратора</p>
      </div>
    );
  }

  if (loading) return (
    <div className="text-center" style={{ padding: 80 }}>
      <Spinner animation="border" style={{ color: '#8B0000', width: 48, height: 48 }} />
      <p style={{ marginTop: 16, color: '#888' }}>Загрузка склада...</p>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
        📦 Склад
        <Badge style={{ background: '#8B0000', marginLeft: 12, padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', color: 'white' }}>
          {parts.length} позиций
        </Badge>
      </h2>

      <Card style={{ borderRadius: 16, border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <Table hover style={{ marginBottom: 0 }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Артикул</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Наименование</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Бренд</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Остаток</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'right' }}>Цена</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part, index) => (
                  <tr key={part.id} style={{ background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 500, color: '#8B0000' }}>{part.articleNumber}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 500 }}>{part.name}</td>
                    <td style={{ padding: '14px 18px', color: '#888' }}>{part.brand || '—'}</td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        background: part.stockQuantity === 0 ? '#f8d7da' : part.stockQuantity <= 3 ? '#fff3cd' : '#d4edda',
                        color: part.stockQuantity === 0 ? '#721c24' : part.stockQuantity <= 3 ? '#856404' : '#155724',
                        padding: '5px 12px', borderRadius: 20, fontWeight: 600, fontSize: '0.85rem'
                      }}>
                        {part.stockQuantity} шт.
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>{part.retailPrice.toFixed(2)} ₽</td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <Button size="sm" onClick={() => openEdit(part)}
                        style={{ background: '#8B0000', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500, fontSize: '0.85rem' }}>
                        ✏️ Изменить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Модальное окно редактирования */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', borderBottom: '3px solid #8B0000' }}>
          <Modal.Title style={{ fontWeight: 700 }}>✏️ {editingPart?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          <p style={{ color: '#888', marginBottom: 20 }}>
            {editingPart?.brand} | Арт: {editingPart?.articleNumber}
          </p>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#333' }}>Остаток на складе</Form.Label>
            <Form.Control
              type="number"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
              min="0"
              style={{ borderRadius: 10, padding: 12, fontSize: '1rem', border: '2px solid #e0e0e0' }}
            />
          </Form.Group>

          <Button onClick={saveStock} style={{
            width: '100%', padding: 12, borderRadius: 10, fontWeight: 600, marginBottom: 12,
            background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', border: 'none',
            boxShadow: '0 3px 10px rgba(40,167,69,0.3)'
          }}>
            💾 Сохранить остаток
          </Button>

          <hr style={{ margin: '20px 0' }} />

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#333' }}>Розничная цена (₽)</Form.Label>
            <Form.Control
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              min="0"
              step="0.01"
              style={{ borderRadius: 10, padding: 12, fontSize: '1rem', border: '2px solid #e0e0e0' }}
            />
          </Form.Group>

          <Button onClick={savePrice} style={{
            width: '100%', padding: 12, borderRadius: 10, fontWeight: 600,
            background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)', border: 'none',
            boxShadow: '0 3px 10px rgba(139,0,0,0.3)'
          }}>
            💾 Сохранить цену
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StockPage;