import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #2d0000 70%, #8B0000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Только едва заметное свечение фона */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(139,0,0,0.15) 0%, transparent 70%)',
      }} />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        {/* Логотип */}
        <div className="text-center mb-4">
          <div style={{
            width: 100,
            height: 100,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            marginBottom: 20,
            border: '1px solid rgba(255,255,255,0.2)',
            animation: 'glow 3s ease-in-out infinite'
          }}>
             <img 
              src="favicon.ico" 
              alt="AutoParts" 
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12,
                background: 'transparent',
                padding: 4,
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size:3rem;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">🚗</span>';
              }}
            />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontWeight: 700, 
            letterSpacing: 4,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            marginBottom: 8
          }}>
            AUTOPARTS
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.6)', 
            letterSpacing: 1,
            fontSize: '0.9rem'
          }}>
            Система управления продажами
          </p>
        </div>

        {/* Форма */}
        <Card style={{
          maxWidth: 420,
          margin: '0 auto',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Заголовок формы */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,0,0,0.9) 0%, rgba(100,0,0,0.9) 100%)',
            padding: '16px 20px',
            color: 'white',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '1.1rem',
            letterSpacing: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            Вход в систему
          </div>

          <Card.Body style={{ padding: 32 }}>
            {error && (
              <Alert 
                variant="danger" 
                style={{
                  background: 'rgba(220,53,69,0.2)',
                  border: '1px solid rgba(220,53,69,0.3)',
                  color: '#ff6b6b',
                  borderRadius: 8,
                  backdropFilter: 'blur(10px)'
                }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ 
                  fontWeight: 500, 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  letterSpacing: 1
                }}>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    borderRadius: 8,
                    padding: 12,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.12)';
                    e.target.style.borderColor = 'rgba(139,0,0,0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139,0,0,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ 
                  fontWeight: 500, 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  letterSpacing: 1
                }}>
                  Пароль
                </Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: 8,
                    padding: 12,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.12)';
                    e.target.style.borderColor = 'rgba(139,0,0,0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139,0,0,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Group>

              <Button
                type="submit"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  letterSpacing: 2,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139,0,0,0.4)',
                  textTransform: 'uppercase'
                }}
                disabled={loading}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.6)';
                  e.target.style.background = 'linear-gradient(135deg, #a00000 0%, #8B0000 100%)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #8B0000 0%, #660000 100%)';
                }}
              >
                {loading ? (
                  <span>
                    <span style={{ 
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                      marginRight: 8
                    }}>⏳</span>
                    Вход...
                  </span>
                ) : 'Войти'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* CSS-анимации */}
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1); }
          50% { box-shadow: 0 10px 40px rgba(139,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px rgba(20,20,20,0.9) inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
}

export default Login;