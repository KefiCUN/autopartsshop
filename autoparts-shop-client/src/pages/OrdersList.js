import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Фильтры
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = user.role === 'Admin' || user.role === 'Manager';

  useEffect(() => { loadOrders(); }, []);

  // Применяем фильтры при изменении
  useEffect(() => { applyFilters(); }, [orders, statusFilter, dateFrom, dateTo]);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5051/api/Orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Ошибка загрузки заказов');
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...orders];

    // Фильтр по статусу
    if (statusFilter) {
      result = result.filter(o => o.status === statusFilter);
    }

    // Фильтр по дате "от"
    if (dateFrom) {
      result = result.filter(o => new Date(o.orderDate) >= new Date(dateFrom));
    }

    // Фильтр по дате "до"
    if (dateTo) {
      result = result.filter(o => new Date(o.orderDate) <= new Date(dateTo + 'T23:59:59'));
    }

    setFilteredOrders(result);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

   const exportToExcel = () => {
    const data = filteredOrders.length > 0 ? filteredOrders : orders;
    if (data.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    let csv = '\uFEFF';
    csv += 'Номер заказа;Клиент;Дата;Сумма;Позиций;Статус\n';
    
    data.forEach(order => {
      const statusText = {
        'New': 'Новый',
        'Paid': 'Оплачен',
        'Shipped': 'Отгружен',
        'Cancelled': 'Отменен',
        'Completed': 'Завершен'
      }[order.status] || order.status;
      
      csv += `${order.orderNumber};${order.customerName};${new Date(order.orderDate).toLocaleDateString('ru-RU')};${order.totalAmount.toFixed(2)} ₽;${order.itemsCount};${statusText}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Заказы_${new Date().toLocaleDateString('ru-RU')}.csv`;
    link.click();
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Удалить заказ? Товары вернутся на склад.')) return;
    try {
      await axios.delete(`http://localhost:5051/api/Orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadOrders();
    } catch (err) {
      alert('Ошибка удаления заказа');
    }
  };

  const updateStatus = async () => {
    try {
      await axios.put(`http://localhost:5051/api/Orders/${selectedOrder}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowStatus(false);
      loadOrders();
    } catch (err) {
      alert('Ошибка обновления статуса');
    }
  };

  const printOrder = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5051/api/Orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const order = response.data;
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Заказ ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; color: #1a1a1a; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #8B0000; padding-bottom: 20px; }
              .header h1 { color: #8B0000; margin: 0; font-size: 28px; }
              .header h2 { margin: 10px 0 5px; font-size: 20px; }
              .header p { color: #666; margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #1a1a1a; color: white; padding: 12px; text-align: left; font-weight: 600; }
              td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
              .total { text-align: right; font-size: 1.3em; font-weight: bold; margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header"><h1>🚗 AUTOPARTS</h1><h2>Заказ №${order.orderNumber}</h2><p>Дата: ${new Date(order.orderDate).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'})}</p></div>
            <div><strong>Клиент:</strong> ${order.customer.fullName}<br><strong>Телефон:</strong> ${order.customer.phone}<br><strong>Авто:</strong> ${order.customer.carModel || 'Не указано'}</div>
            <table><thead><tr><th>Артикул</th><th>Наименование</th><th>Бренд</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead><tbody>${order.items.map(item => `<tr><td>${item.partArticle}</td><td>${item.partName}</td><td>${item.partBrand || '-'}</td><td>${item.quantity}</td><td>${item.priceAtOrder.toFixed(2)} ₽</td><td>${item.total.toFixed(2)} ₽</td></tr>`).join('')}</tbody></table>
            <div class="total">Итого: ${order.totalAmount.toFixed(2)} ₽</div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    } catch (err) {
      alert('Ошибка загрузки заказа');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'New') return <span style={{ background: '#f0f0f0', color: '#8B0000', border: '1px solid #8B0000', padding: '5px 14px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block' }}>🆕 Новый</span>;
    if (status === 'Paid') return <span style={{ background: '#e6f5e6', color: '#1a6b1a', padding: '5px 14px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block' }}>💰 Оплачен</span>;
    if (status === 'Shipped') return <span style={{ background: '#f5f0e6', color: '#8B6B00', padding: '5px 14px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block' }}>📦 Отгружен</span>;
    if (status === 'Cancelled') return <span style={{ background: '#e8e8e8', color: '#666', padding: '5px 14px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block' }}>❌ Отменен</span>;
    return <span style={{ background: '#e6f5e6', color: '#1a6b1a', padding: '5px 14px', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem', display: 'inline-block' }}>✅ Завершен</span>;
  };

  if (loading) return (
    <div className="text-center" style={{ padding: 80 }}>
      <Spinner animation="border" style={{ color: '#8B0000', width: 48, height: 48 }} />
      <p style={{ marginTop: 16, color: '#888' }}>Загрузка заказов...</p>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
        📋 Заказы
        {filteredOrders.length > 0 && (
          <Badge style={{ background: '#8B0000', marginLeft: 12, padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', color: 'white' }}>
            {filteredOrders.length}
          </Badge>
        )}
      </h2>

      {/* ===== ФИЛЬТРЫ ===== */}
      <Card style={{ borderRadius: 14, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '12px 18px', color: 'white', fontWeight: 600 }}>
          🔍 Фильтры
        </div>
        <Card.Body style={{ padding: 18 }}>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Статус</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ borderRadius: 8, padding: 8 }}>
                  <option value="">Все статусы</option>
                  <option value="New">🆕 Новый</option>
                  <option value="Paid">💰 Оплачен</option>
                  <option value="Shipped">📦 Отгружен</option>
                  <option value="Completed">✅ Завершен</option>
                  <option value="Cancelled">❌ Отменен</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Дата от</Form.Label>
                <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ borderRadius: 8, padding: 8 }} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Дата до</Form.Label>
                <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ borderRadius: 8, padding: 8 }} />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end gap-2">
              <Button onClick={exportToExcel} style={{ borderRadius: 8, padding: '8px 12px', background: '#28a745', border: 'none', fontWeight: 500, fontSize: '0.85rem', flex: 1 }}>
                📥 Экспорт
              </Button>
              <Button onClick={resetFilters} style={{ borderRadius: 8, padding: '8px 12px', background: '#6c757d', border: 'none', fontWeight: 500, fontSize: '0.85rem', flex: 1 }}>
                🔄 Сбросить
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Таблица */}
      <Card style={{ borderRadius: 16, border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <Table hover style={{ marginBottom: 0 }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Номер заказа</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Клиент</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Дата</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'right' }}>Сумма</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Поз.</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none' }}>Статус</th>
                  <th style={{ padding: '16px 18px', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', textAlign: 'center' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} style={{ background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#8B0000' }}>{order.orderNumber}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 500 }}>{order.customerName}</td>
                    <td style={{ padding: '14px 18px', color: '#888', fontSize: '0.9rem' }}>
                      {new Date(order.orderDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>{order.totalAmount.toFixed(2)} ₽</td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', color: '#888' }}>{order.itemsCount}</td>
                    <td style={{ padding: '14px 18px' }}>
                      {canManage ? (
                        <span style={{ cursor: 'pointer', borderBottom: '1px dashed #8B0000' }}
                          onClick={() => { setSelectedOrder(order.id); setNewStatus(order.status); setShowStatus(true); }}>
                          {getStatusBadge(order.status)}
                        </span>
                      ) : getStatusBadge(order.status)}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <Button variant="link" size="sm" onClick={() => printOrder(order.id)}
                        style={{ background: '#f5f5f5', borderRadius: 8, padding: '8px 14px', color: '#888', textDecoration: 'none', fontSize: '1.1rem' }}
                        title="Печать">🖨</Button>
                      {canManage && (
                        <Button variant="link" size="sm" onClick={() => deleteOrder(order.id)}
                          style={{ background: '#fff5f5', borderRadius: 8, padding: '8px 14px', color: '#dc3545', textDecoration: 'none', fontSize: '1.1rem', marginLeft: 4 }}
                          title="Удалить">🗑</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
              <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>
                {orders.length === 0 ? 'Заказов пока нет' : 'Нет заказов по фильтрам'}
              </p>
              {orders.length > 0 && (
                <Button variant="link" onClick={resetFilters} style={{ color: '#8B0000' }}>Сбросить фильтры</Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Модальное окно смены статуса */}
      <Modal show={showStatus} onHide={() => setShowStatus(false)} centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', borderBottom: '3px solid #8B0000' }}>
          <Modal.Title style={{ fontWeight: 700 }}>Изменение статуса</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ borderRadius: 10, padding: 12 }}>
            <option value="New">🆕 Новый</option>
            <option value="Paid">💰 Оплачен</option>
            <option value="Shipped">📦 Отгружен</option>
            <option value="Completed">✅ Завершен</option>
            <option value="Cancelled">❌ Отменен</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatus(false)} style={{ borderRadius: 8 }}>Отмена</Button>
          <Button onClick={updateStatus} style={{ background: '#8B0000', border: 'none', borderRadius: 8, fontWeight: 600 }}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrdersList;