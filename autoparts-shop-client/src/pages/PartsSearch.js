import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Badge, Alert, Spinner, Modal, ListGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';

function PartsSearch({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  const [showAnalogues, setShowAnalogues] = useState(false);
  const [analogues, setAnalogues] = useState(null);
  const [loadingAnalogues, setLoadingAnalogues] = useState(false);

  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const response = await axios.get(
        `http://localhost:5051/api/Parts/search?term=${encodeURIComponent(searchTerm)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParts(response.data);
    } catch (err) {
      setError('Ошибка при поиске');
    }
    setLoading(false);
  };

  const loadAnalogues = async (partId) => {
    setLoadingAnalogues(true);
    try {
      const response = await axios.get(
        `http://localhost:5051/api/Parts/${partId}/analogues`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalogues(response.data);
      setShowAnalogues(true);
    } catch (err) {
      setError('Ошибка загрузки аналогов');
    }
    setLoadingAnalogues(false);
  };

const getStockBadge = (status, quantity) => {
  switch (status) {
    case 'OutOfStock': 
      return <span style={{ 
        background: '#f5f5f5', 
        color: '#999', 
        border: '1px solid #ddd',
        padding: '5px 12px', 
        borderRadius: 20, 
        fontWeight: 500,
        fontSize: '0.8rem',
        display: 'inline-block'
      }}>❌ Нет в наличии</span>;
    case 'LowStock': 
      return <span style={{ 
        background: '#fff8e6', 
        color: '#8B6B00', 
        border: '1px solid #f0d060',
        padding: '5px 12px', 
        borderRadius: 20, 
        fontWeight: 500,
        fontSize: '0.8rem',
        display: 'inline-block'
      }}>⚠️ Мало: {quantity} шт.</span>;
    default: 
      return <span style={{ 
        background: '#f5f5f5', 
        color: '#4a4a4a', 
        border: '1px solid #ddd',
        padding: '5px 12px', 
        borderRadius: 20, 
        fontWeight: 500,
        fontSize: '0.8rem',
        display: 'inline-block'
      }}>✅ В наличии: {quantity} шт.</span>;
  }
};

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
        <span style={{ marginRight: 10 }}>🔍</span>
        Поиск запчастей
      </h2>
      
      {/* Поисковая строка */}
      <div style={{
        background: 'white',
        padding: 28,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: 28,
        border: '1px solid #e0e0e0'
      }}>
        <Form onSubmit={handleSearch}>
          <InputGroup size="lg">
            <Form.Control
              type="text"
              placeholder="Введите артикул, название, бренд или модель авто..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: 12,
                border: '2px solid #e0e0e0',
                padding: '14px 18px',
                fontSize: '1.05rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8B0000';
                e.target.style.boxShadow = '0 0 0 3px rgba(139,0,0,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <Button 
              type="submit" 
              disabled={loading}
              style={{
                borderRadius: 12,
                marginLeft: 10,
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
                border: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                letterSpacing: 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139,0,0,0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(139,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(139,0,0,0.3)';
              }}
            >
              {loading ? (
                <><Spinner size="sm" style={{ marginRight: 8 }} /> Поиск...</>
              ) : (
                <>🔍 Найти</>
              )}
            </Button>
          </InputGroup>
        </Form>
      </div>

      {error && <Alert variant="danger" style={{ borderRadius: 12 }}>{error}</Alert>}
      {searched && !loading && parts.length === 0 && (
        <Alert variant="info" style={{ borderRadius: 12, background: '#d1ecf1', border: 'none', color: '#0c5460' }}>
          🔍 Ничего не найдено. Попробуйте изменить запрос.
        </Alert>
      )}

      {/* Результаты */}
      <Row>
        {parts.map(part => (
          <Col key={part.id} md={6} lg={4} className="mb-4">
            <Card style={{
              borderRadius: 14,
              border: part.stockQuantity === 0 ? '2px solid #dc3545' : '1px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease',
              height: '100%',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
            >
              <Card.Body style={{ padding: 22 }}>
                {part.imageUrl && (
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <img 
                      src={`http://localhost:5051${part.imageUrl}`} 
                      alt={part.name}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: 120, 
                        objectFit: 'contain',
                        borderRadius: 8
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                <Card.Title style={{ 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontSize: '1.05rem',
                  marginBottom: 6
                }}>
                  {part.name}
                </Card.Title>
                <Card.Subtitle style={{ 
                  color: '#888', 
                  fontSize: '0.85rem',
                  marginBottom: 12
                }}>
                  {part.brand && `${part.brand} • `}Арт: {part.articleNumber}
                </Card.Subtitle>
                
                <div style={{ marginBottom: 14 }}>
                  {getStockBadge(part.stockStatus, part.stockQuantity)}
                </div>
                
                <div style={{ 
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: 16
                }}>
                  {part.retailPrice.toFixed(2)} ₽
                </div>
                
                <div className="d-grid gap-2">
                  <Button
                    onClick={() => onAddToCart(part)}
                    disabled={part.stockQuantity === 0}
                    style={{
                      borderRadius: 10,
                      padding: '12px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      border: 'none',
                      background: part.stockQuantity > 0 
                        ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' 
                        : '#ccc',
                      boxShadow: part.stockQuantity > 0 ? '0 4px 12px rgba(40,167,69,0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (part.stockQuantity > 0) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(40,167,69,0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = part.stockQuantity > 0 ? '0 4px 12px rgba(40,167,69,0.3)' : 'none';
                    }}
                  >
                    {part.stockQuantity > 0 ? '🛒 В корзину' : '❌ Нет в наличии'}
                  </Button>
                  
                  {part.stockQuantity === 0 && (
                    <Button
                      size="sm"
                      onClick={() => loadAnalogues(part.id)}
                      disabled={loadingAnalogues}
                      style={{
                        borderRadius: 10,
                        padding: '10px',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        background: 'transparent',
                        border: '2px solid #8B0000',
                        color: '#8B0000',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#8B0000';
                        e.target.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#8B0000';
                      }}
                    >
                      🔄 Показать аналоги
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Модальное окно аналогов */}
      <Modal 
        show={showAnalogues} 
        onHide={() => setShowAnalogues(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          borderBottom: '3px solid #8B0000'
        }}>
          <Modal.Title style={{ fontWeight: 700, letterSpacing: 1 }}>
            🔄 Аналоги запчасти
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24 }}>
          {analogues && (
            <>
              <Alert style={{
                background: '#fff3cd',
                border: 'none',
                borderRadius: 10,
                color: '#856404'
              }}>
                <strong>🔸 Оригинал:</strong> {analogues.originalPart.name} ({analogues.originalPart.brand}) — {' '}
                <strong>{analogues.originalPart.retailPrice} ₽</strong>
              </Alert>
              
              <ListGroup>
                {analogues.analogues.map(a => (
                  <ListGroup.Item 
                    key={a.id} 
                    style={{
                      borderRadius: 10,
                      marginBottom: 8,
                      border: '1px solid #e8e8e8',
                      padding: 16
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#1a1a1a' }}>{a.name}</strong>
                        <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>
                          {a.brand} | Арт: {a.articleNumber}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <Badge style={{
                            background: a.stockQuantity > 0 ? '#d4edda' : '#f8d7da',
                            color: a.stockQuantity > 0 ? '#155724' : '#721c24',
                            padding: '5px 10px',
                            borderRadius: 20,
                            fontWeight: 500,
                            fontSize: '0.8rem'
                          }}>
                            {a.stockQuantity > 0 ? `✅ В наличии: ${a.stockQuantity}` : '❌ Нет в наличии'}
                          </Badge>
                          {a.savingsPercent > 0 && (
                            <Badge style={{
                              background: '#d1ecf1',
                              color: '#0c5460',
                              padding: '5px 10px',
                              borderRadius: 20,
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              marginLeft: 6
                            }}>
                              💰 Дешевле на {a.savingsPercent}%
                            </Badge>
                          )}
                          {a.savingsPercent < 0 && (
                            <Badge style={{
                              background: '#fff3cd',
                              color: '#856404',
                              padding: '5px 10px',
                              borderRadius: 20,
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              marginLeft: 6
                            }}>
                              📈 Дороже на {Math.abs(a.savingsPercent)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#8B0000',
                          marginBottom: 8
                        }}>
                          {a.retailPrice.toFixed(2)} ₽
                        </div>
                        <Button
                          disabled={a.stockQuantity === 0}
                          size="sm"
                          onClick={() => {
                            onAddToCart(a);
                            setShowAnalogues(false);
                          }}
                          style={{
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 600,
                            background: a.stockQuantity > 0 
                              ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' 
                              : '#ccc',
                            border: 'none',
                            boxShadow: a.stockQuantity > 0 ? '0 3px 10px rgba(40,167,69,0.3)' : 'none'
                          }}
                        >
                          🛒 В корзину
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PartsSearch;