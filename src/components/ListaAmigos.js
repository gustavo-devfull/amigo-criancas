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
          <h1 className="h4 h-md-2 mb-0" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>Lista de Sugestões de Amigo Secreto</h1>
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
          
          return (
            <Col key={amigo} xs={12} sm={6} md={4} lg={3}>
              <Card 
                data-amigo-nome={amigo}
                style={{
                  backgroundColor: '#ffffff',
                  border: temPresentes ? '2px solid #ff8c00' : '1px solid #e0e0e0',
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
                  flex: 1
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
                      fontSize: '1.25rem'
                    }}>
                      {amigo}
                    </h5>
                    {!estaExpandido && (
                      <Button 
                        variant={temPresentes ? "outline-primary" : "primary"}
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
                          gap: '0.25rem'
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
                      <div className="mb-3">
                        {presentesDoAmigo.map((presente) => (
                          <div key={presente.id} className="mb-2">
                            <PresenteCard
                              presente={presente}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleAmigo(amigo)}
                          style={{
                            width: '100%'
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
                            gap: '0.5rem'
                          }}
                        >
                          <span>+</span> Adicionar Presente
                        </Button>
                      </div>
                    </>
                  )}
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
      />
    </Container>
  );
};

export default ListaAmigos;

