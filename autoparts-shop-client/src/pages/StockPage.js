import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function StockPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  const [showCreate, setShowCreate] = useState(false);
const [newPart, setNewPart] = useState({
    articleNumber: '',
    name: '',
    brand: '',
    imageUrl: '',
    imageFile: null,
    retailPrice: '',
    stockQuantity: '',
    minStockQuantity: '3'
  });

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

      // Создать новую запчасть
  const createPart = async () => {
    if (!newPart.articleNumber || !newPart.name || !newPart.retailPrice) {
      alert('Заполните обязательные поля: артикул, наименование, цена');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('articleNumber', newPart.articleNumber);
      formData.append('name', newPart.name);
      formData.append('brand', newPart.brand || '');
      formData.append('retailPrice', newPart.retailPrice);
      formData.append('stockQuantity', newPart.stockQuantity || '0');
      formData.append('minStockQuantity', newPart.minStockQuantity || '3');
      formData.append('imageUrl', newPart.imageUrl || '');
      
      if (newPart.imageFile) {
        formData.append('image', newPart.imageFile);
      }

      await axios.post('http://localhost:5051/api/Parts/create', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      setShowCreate(false);
      setNewPart({ articleNumber: '', name: '', brand: '', imageUrl: '', imageFile: null, retailPrice: '', stockQuantity: '', minStockQuantity: '3' });
      loadParts();
    } catch (err) {
      alert('Ошибка создания запчасти');
    }
  };

  const deletePart = async (partId, partName) => {
    if (!window.confirm(`Удалить запчасть "${partName}"?`)) return;
    try {
      await axios.delete(`http://localhost:5051/api/Parts/${partId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadParts();
    } catch (err) {
      alert('Ошибка удаления запчасти');
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
        <Button onClick={() => setShowCreate(true)} style={{
          float: 'right', background: '#28a745', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600
        }}>
          + Добавить запчасть
        </Button>
      </h2>

      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: 16, borderRadius: 12, marginBottom: 20 }}>{error}</div>}

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
                        style={{ background: '#8B0000', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 500, fontSize: '0.8rem', marginRight: 4 }}>✏️</Button>
                      <Button size="sm" onClick={() => deletePart(part.id, part.name)}
                        style={{ background: '#dc3545', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 500, fontSize: '0.8rem' }}>🗑</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {parts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
              <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Склад пуст</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', borderBottom: '3px solid #8B0000' }}>
          <Modal.Title style={{ fontWeight: 700 }}>✏️ {editingPart?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          <p style={{ color: '#888', marginBottom: 20 }}>{editingPart?.brand} | Арт: {editingPart?.articleNumber}</p>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#333' }}>Остаток на складе</Form.Label>
            <Form.Control type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} min="0"
              style={{ borderRadius: 10, padding: 12, fontSize: '1rem', border: '2px solid #e0e0e0' }} />
          </Form.Group>
          <Button onClick={saveStock} style={{ width: '100%', padding: 12, borderRadius: 10, fontWeight: 600, marginBottom: 12,
            background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', border: 'none', boxShadow: '0 3px 10px rgba(40,167,69,0.3)' }}>💾 Сохранить остаток</Button>
          <hr style={{ margin: '20px 0' }} />
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#333' }}>Розничная цена (₽)</Form.Label>
            <Form.Control type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} min="0" step="0.01"
              style={{ borderRadius: 10, padding: 12, fontSize: '1rem', border: '2px solid #e0e0e0' }} />
          </Form.Group>
          <Button onClick={savePrice} style={{ width: '100%', padding: 12, borderRadius: 10, fontWeight: 600,
            background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)', border: 'none', boxShadow: '0 3px 10px rgba(139,0,0,0.3)' }}>💾 Сохранить цену</Button>
        </Modal.Body>
      </Modal>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg">
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', borderBottom: '3px solid #8B0000' }}>
          <Modal.Title style={{ fontWeight: 700 }}>➕ Новая запчасть</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Артикул *</Form.Label>
                <Form.Control placeholder="2101-1000100" value={newPart.articleNumber}
                  onChange={(e) => setNewPart({...newPart, articleNumber: e.target.value})}
                  style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Бренд</Form.Label>
                <Form.Control placeholder="Bosch" value={newPart.brand}
                  onChange={(e) => setNewPart({...newPart, brand: e.target.value})}
                  style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Наименование *</Form.Label>
            <Form.Control placeholder="Масляный фильтр" value={newPart.name}
              onChange={(e) => setNewPart({...newPart, name: e.target.value})}
              style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
          </Form.Group>
                    <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Изображение</Form.Label>
            <Form.Control 
              type="file"
              accept="image/*"
              onChange={(e) => setNewPart({...newPart, imageFile: e.target.files[0]})}
              style={{ borderRadius: 10, padding: 8, border: '2px solid #e0e0e0' }} 
            />
            <small style={{ color: '#888' }}>Или укажите ссылку ниже</small>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Ссылка на изображение</Form.Label>
            <Form.Control 
              placeholder="https://example.com/image.jpg" 
              value={newPart.imageUrl || ''}
              onChange={(e) => setNewPart({...newPart, imageUrl: e.target.value})}
              style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} 
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Цена *</Form.Label>
                <Form.Control type="number" placeholder="650" value={newPart.retailPrice}
                  onChange={(e) => setNewPart({...newPart, retailPrice: e.target.value})}
                  style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Остаток</Form.Label>
                <Form.Control type="number" placeholder="0" value={newPart.stockQuantity}
                  onChange={(e) => setNewPart({...newPart, stockQuantity: e.target.value})}
                  style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Мин. остаток</Form.Label>
                <Form.Control type="number" placeholder="3" value={newPart.minStockQuantity}
                  onChange={(e) => setNewPart({...newPart, minStockQuantity: e.target.value})}
                  style={{ borderRadius: 10, padding: 10, border: '2px solid #e0e0e0' }} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)} style={{ borderRadius: 8 }}>Отмена</Button>
          <Button onClick={createPart} style={{ background: '#28a745', border: 'none', borderRadius: 8, fontWeight: 600 }}>✅ Создать</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StockPage;