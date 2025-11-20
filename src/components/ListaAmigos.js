import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Card } from 'react-bootstrap';
import PresenteCard from './PresenteCard';
import PresenteForm from './PresenteForm';
import { getPresentes, deletePresente } from '../services/presentesService';
import { AMIGOS } from '../data/amigos';

const ListaAmigos = () => {
  const [presentes, setPresentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [presenteEditando, setPresenteEditando] = useState(null);
  const [amigoFiltro, setAmigoFiltro] = useState(null);
  const [amigosExpandidos, setAmigosExpandidos] = useState({});

  useEffect(() => {
    loadPresentes();
  }, []);

  const loadPresentes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPresentes();
      setPresentes(data);
    } catch (err) {
      setError('Erro ao carregar presentes. Verifique sua conexão com o Firebase.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (amigo = null) => {
    setPresenteEditando(null);
    setAmigoFiltro(amigo);
    setShowForm(true);
  };

  const handleEdit = (presente) => {
    setPresenteEditando(presente);
    setAmigoFiltro(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePresente(id);
      await loadPresentes();
    } catch (err) {
      alert('Erro ao excluir presente. Tente novamente.');
      console.error(err);
    }
  };

  const handleFormSuccess = (amigoNome) => {
    loadPresentes();
    
    // Expandir o card do amigo após salvar
    if (amigoNome) {
      setAmigosExpandidos(prev => ({ ...prev, [amigoNome]: true }));
      
      // Scroll suave até o card do amigo após salvar
      setTimeout(() => {
        const cardItem = document.querySelector(`[data-amigo-nome="${amigoNome}"]`);
        if (cardItem) {
          cardItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const toggleAmigo = (amigo) => {
    setAmigosExpandidos(prev => ({
      ...prev,
      [amigo]: !prev[amigo]
    }));
  };

  const getPresentesPorAmigo = (amigo) => {
    return presentes.filter(p => p.amigo === amigo);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-3 mt-md-4 px-3 px-md-4" style={{ maxWidth: '1400px' }}>
      <Row className="mb-3 mb-md-4">
        <Col>
          <h1 
            className="h4 h-md-2 mb-0" 
            style={{ 
              fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
              paddingTop: '50px',
              textAlign: 'center',
              color: '#d3d3d3'
            }}
          >
            Lista de Sugestões de presentes para as crianças
          </h1>
          <p 
            style={{ 
              textAlign: 'center',
              color: '#d3d3d3',
              marginTop: '1rem',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              opacity: 0.8
            }}
          >
            Marque o presente como comprado quando você escolher o presente comprado.
            Você pode cadastrar o presente com uma descrição, com um link ou com uma foto.
          </p>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="g-3 g-md-4">
        {AMIGOS.map((amigo) => {
          const presentesDoAmigo = getPresentesPorAmigo(amigo);
          const temPresentes = presentesDoAmigo.length > 0;
          const estaExpandido = amigosExpandidos[amigo];
          const quantidadePresentes = presentesDoAmigo.length;
          const porcentagemProgresso = Math.min((quantidadePresentes / 3) * 100, 100);
          
          // Cores de borda personalizadas (se necessário)
          const amigosComBordaLaranja = [];
          const temBordaLaranja = amigosComBordaLaranja.includes(amigo);
          
          const amigosComBordaRoxa = [];
          const temBordaRoxa = amigosComBordaRoxa.includes(amigo);
          
          const amigosComBordaRosa = [];
          const temBordaRosa = amigosComBordaRosa.includes(amigo);
          
          const amigosComBordaVermelha = [];
          const temBordaVermelha = amigosComBordaVermelha.includes(amigo);
          
          return (
            <Col key={amigo} xs={12} sm={6} md={4} lg={3}>
              <Card 
                data-amigo-nome={amigo}
                style={{
                  backgroundColor: temPresentes ? '#113C75' : '#0d6efd',
                  border: 'none',
                  ...(temBordaLaranja && { borderTop: '3px solid #ff8c00' }),
                  ...(temBordaRoxa && { borderTop: '3px solid #ffd700' }),
                  ...(temBordaRosa && { borderTop: '3px solid #ffc0cb' }),
                  ...(temBordaVermelha && { borderTop: '3px solid #ff0000' }),
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Card.Body style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '1.5rem',
                  paddingBottom: '1.75rem',
                  flex: 1,
                  position: 'relative'
                }}>
                  {/* Cabeçalho com nome e botão */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: estaExpandido ? '1rem' : 0
                  }}>
                    <h5 style={{ 
                      fontWeight: 'bold', 
                      margin: 0,
                      fontSize: '1.25rem',
                      color: '#ffffff'
                    }}>
                      {amigo}
                    </h5>
                    {!estaExpandido && (
                      <Button 
                        variant={temPresentes ? "primary" : "primary"}
                        size="sm"
                        onClick={() => {
                          if (temPresentes) {
                            toggleAmigo(amigo);
                          } else {
                            handleAdd(amigo);
                          }
                        }}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          ...(temPresentes ? {
                            backgroundColor: '#28a745',
                            borderColor: '#28a745',
                            color: '#ffffff'
                          } : {
                            backgroundColor: '#0a5fd4',
                            border: 'none',
                            color: '#ffffff'
                          })
                        }}
                        onMouseEnter={(e) => {
                          if (temPresentes) {
                            e.target.style.backgroundColor = '#218838';
                            e.target.style.borderColor = '#218838';
                          } else {
                            e.target.style.backgroundColor = '#094fc0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (temPresentes) {
                            e.target.style.backgroundColor = '#28a745';
                            e.target.style.borderColor = '#28a745';
                          } else {
                            e.target.style.backgroundColor = '#0a5fd4';
                          }
                        }}
                      >
                        {temPresentes ? (
                          'Ver Presentes'
                        ) : (
                          <>
                            <span>+</span> Adicionar Presente
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Conteúdo expandido - só aparece quando tem presentes */}
                  {estaExpandido && temPresentes && (
                    <>
                      <div>
                        {presentesDoAmigo.map((presente) => (
                          <PresenteCard
                            key={presente.id}
                            presente={presente}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onUpdate={loadPresentes}
                          />
                        ))}
                      </div>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleAmigo(amigo)}
                          style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            borderColor: '#ffffff'
                          }}
                        >
                          Recolher
                        </Button>
                        <Button 
                          variant="primary"
                          onClick={() => handleAdd(amigo)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#0a5fd4',
                            border: 'none',
                            color: '#ffffff'
                          }}
                        >
                          <span>+</span> Adicionar Presente
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {/* Barra de progresso na base do card */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0 0 8px 8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${porcentagemProgresso}%`,
                      backgroundColor: porcentagemProgresso === 100 ? '#4ade80' : '#fbbf24',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <PresenteForm
        show={showForm}
        handleClose={() => {
          setShowForm(false);
          setPresenteEditando(null);
          setAmigoFiltro(null);
        }}
        presente={presenteEditando}
        amigoPreSelecionado={amigoFiltro}
        onSuccess={(amigoNome) => {
          const amigoParaExpandir = amigoNome || presenteEditando?.amigo || amigoFiltro;
          handleFormSuccess(amigoParaExpandir);
        }}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default ListaAmigos;

