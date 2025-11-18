import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
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
      
      // Scroll suave até o card do amigo
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
          <h1 className="h4 h-md-2 mb-0" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>Lista de Presentes - Amigo Secreto</h1>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {presentes.length === 0 && !loading && (
        <Row>
          <Col>
            <Alert variant="info">
              Nenhum presente cadastrado ainda. Clique em "Adicionar Presente" para começar!
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <div className="d-flex flex-column gap-3 mb-4">
            {AMIGOS.map((amigo, index) => {
              const presentesDoAmigo = getPresentesPorAmigo(amigo);
              const temPresentes = presentesDoAmigo.length > 0;
              const estaExpandido = amigosExpandidos[amigo];
              
              return (
                <Card 
                  key={amigo}
                  data-amigo-nome={amigo}
                  style={{
                    backgroundColor: temPresentes ? '#d4edda' : '#ffffff',
                    border: `1px solid ${temPresentes ? '#c3e6cb' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Card.Header 
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: temPresentes ? '#c3e6cb' : '#f8f9fa',
                      borderBottom: `1px solid ${temPresentes ? '#b1dfbb' : '#e0e0e0'}`
                    }}
                    onClick={() => toggleAmigo(amigo)}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-1 gap-md-0">
                      <span className="text-break" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                        {index + 1}. {amigo}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <Badge 
                          bg={temPresentes ? 'success' : 'secondary'} 
                          className="flex-shrink-0" 
                          style={{ fontSize: '0.9rem', padding: '0.5em 0.75em' }}
                        >
                          {presentesDoAmigo.length} {presentesDoAmigo.length === 1 ? 'presente' : 'presentes'}
                        </Badge>
                        <span style={{ fontSize: '1.2rem' }}>
                          {estaExpandido ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  </Card.Header>
                  
                  {estaExpandido && (
                    <Card.Body className="px-2 px-md-4 py-3">
                      <div className="mb-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleAdd(amigo)}
                          className="w-100 w-md-auto"
                        >
                          ➕ Adicionar Presente para {amigo}
                        </Button>
                      </div>
                      {presentesDoAmigo.length === 0 ? (
                        <Alert variant="light">
                          Nenhum presente cadastrado para {amigo} ainda.
                        </Alert>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {presentesDoAmigo.map((presente) => (
                            <div key={presente.id} style={{ width: '100%' }}>
                              <PresenteCard
                                presente={presente}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  )}
                </Card>
              );
            })}
          </div>
        </Col>
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

