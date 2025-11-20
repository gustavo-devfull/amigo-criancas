import React, { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { toggleComprado } from '../services/presentesService';

const PresenteCard = ({ presente, onEdit, onDelete, onUpdate }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isComprado = presente.comprado === true;
  
  // Determinar o nome do presente
  const nomePresente = presente.nome || 'Presente';
  
  // Determinar a descrição
  const descricao = presente.descricao || '';
  
  // Verificar se é um link
  const isLink = presente.tipo === 'link' && presente.link;
  
  // Verificar se tem imagem
  const temImagem = presente.tipo === 'upload' && presente.imagemStorage;
  const imagemSrc = temImagem ? presente.imagemStorage : null;

  const handleToggleComprado = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleComprado(presente.id, !isComprado);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao marcar como comprado:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div 
      style={{ position: 'relative', marginBottom: '1rem' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ícone de editar fora do card, acima e à direita */}
      {!isComprado && (
        <button
          onClick={() => onEdit && onEdit(presente)}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '32px',
            height: '32px',
            backgroundColor: '#a8e6cf',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            transition: 'all 0.2s',
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#8dd3c0';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#a8e6cf';
            e.target.style.transform = 'scale(1)';
          }}
          title="Editar presente"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: '#2d8659' }}
          >
            <path 
              d="M11.3333 2.00004C11.5084 1.82492 11.7163 1.68606 11.9439 1.59131C12.1715 1.49657 12.4145 1.44775 12.66 1.44775C12.9055 1.44775 13.1485 1.49657 13.3761 1.59131C13.6037 1.68606 13.8116 1.82492 13.9867 2.00004C14.1618 2.17515 14.3006 2.38309 14.3954 2.61067C14.4901 2.83825 14.5389 3.08124 14.5389 3.32671C14.5389 3.57218 14.4901 3.81517 14.3954 4.04275C14.3006 4.27033 14.1618 4.47827 13.9867 4.65338L5.17333 13.4667L1.33333 14.6667L2.53333 10.8267L11.3333 2.00004Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      
      <Card 
        style={{ 
          width: '100%',
          border: isComprado ? '2px solid #28a745' : '0.5px solid #ffffff',
          borderRadius: '8px',
          backgroundColor: isComprado ? '#28a745' : '#ffffff',
          position: 'relative',
          boxShadow: isComprado ? '0 4px 8px rgba(40, 167, 69, 0.2)' : 'none',
        }}
      >
      <Card.Body style={{ padding: '1rem', position: 'relative' }}>
        {/* Imagem em linha completa quando presente */}
        {temImagem && (
          <div 
            style={{ 
              width: '100%',
              marginBottom: '1rem',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              maxHeight: '300px'
            }}
            onClick={() => setShowLightbox(true)}
          >
            <img 
              src={imagemSrc}
              alt={nomePresente}
              style={{ 
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Dados do presente */}
        <div style={{ width: '100%' }}>
            {isLink ? (
              <>
                <Card.Title 
                  style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: isComprado ? '#ffffff' : '#212529',
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}
                >
                  {nomePresente || 'Link'}
                </Card.Title>
                    <button
                      onClick={() => window.open(presente.link, '_blank', 'noopener,noreferrer')}
                      style={{ 
                        backgroundColor: isComprado ? '#ffffff' : '#0d6efd',
                        color: isComprado ? '#28a745' : '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: descricao ? '0.5rem' : 0,
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = isComprado ? '#f0f0f0' : '#0b5ed7';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = isComprado ? '#ffffff' : '#0d6efd';
                      }}
                    >
                      Ver sugestão
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ flexShrink: 0 }}
                      >
                        <path 
                          d="M6.66667 8.66667C6.95281 9.05286 7.31819 9.37749 7.73733 9.62L8.66667 8.69067C8.35111 8.45689 8.08015 8.17074 7.86667 7.84667M9.33333 7.33333C9.61948 6.94714 9.98486 6.62251 10.404 6.38L9.47467 5.45067C9.15911 5.68445 8.88815 5.9706 8.67467 6.29467M11.3333 4.66667L13.3333 2.66667M6 2.66667H3.33333C2.89131 2.66667 2.46738 2.84226 2.15482 3.15482C1.84226 3.46738 1.66667 3.89131 1.66667 4.33333V12.6667C1.66667 13.1087 1.84226 13.5326 2.15482 13.8452C2.46738 14.1577 2.89131 14.3333 3.33333 14.3333H11.6667C12.1087 14.3333 12.5326 14.1577 12.8452 13.8452C13.1577 13.5326 13.3333 13.1087 13.3333 12.6667V10" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
              </>
            ) : (
              <Card.Title 
                style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  color: isComprado ? '#ffffff' : '#212529',
                  margin: 0,
                  marginBottom: descricao ? '0.5rem' : 0
                }}
              >
                {nomePresente}
              </Card.Title>
            )}
            
            {descricao && (
              <Card.Text 
              style={{ 
                  fontSize: '0.9rem', 
                  color: isComprado ? '#ffffff' : '#6c757d',
                  marginBottom: '0.5rem',
                  lineHeight: '1.5'
                }}
              >
                {descricao}
              </Card.Text>
            )}
            
            {!isLink && (
              <div style={{
                fontSize: '12px',
                color: isComprado ? '#ffffff' : '#6c757d',
                textAlign: 'center',
                marginTop: '0.5rem',
                paddingTop: '0.5rem'
              }}>
                Sugestão sem link online.
              </div>
            )}
            
            {/* Botão de marcar como comprado */}
            <div style={{ marginTop: '0.75rem' }}>
              <button
                onClick={handleToggleComprado}
                disabled={isToggling}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isComprado ? '#dc3545' : '#28a745',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isToggling ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  opacity: isToggling ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isToggling) {
                    e.target.style.backgroundColor = isComprado ? '#c82333' : '#218838';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isComprado ? '#dc3545' : '#28a745';
                  e.target.style.transform = 'scale(1)';
                }}
                title={isComprado ? 'Marcar como não comprado' : 'Marcar como comprado'}
              >
                {isToggling ? (
                  <>
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ 
                        animation: 'spin 1s linear infinite',
                        display: 'inline-block'
                      }}
                    >
                      <circle 
                        cx="8" 
                        cy="8" 
                        r="7" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeDasharray="44" 
                        strokeDashoffset="22"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.3"
                      />
                      <circle 
                        cx="8" 
                        cy="8" 
                        r="7" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeDasharray="44" 
                        strokeDashoffset="11"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    {isComprado ? 'Desmarcando...' : 'Marcando...'}
                  </>
                ) : isComprado ? (
                  <>
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M4 8L7 11L12 4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    Presente Comprado
                  </>
                ) : (
                  <>
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M4 8L7 11L12 4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    Marcar como Comprado
                  </>
                )}
              </button>
            </div>
        </div>
        </Card.Body>

      {/* Lightbox Modal */}
      {temImagem && (
      <Modal 
        show={showLightbox} 
        onHide={() => setShowLightbox(false)}
        size="xl"
        centered
      >
          <Modal.Header closeButton>
            <Modal.Title>{nomePresente}</Modal.Title>
        </Modal.Header>
          <Modal.Body style={{ textAlign: 'center', padding: '2rem' }}>
            <img 
              src={imagemSrc}
              alt={nomePresente}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
        </Modal.Body>
        </Modal>
      )}
    </Card>
    </div>
  );
};

export default PresenteCard;

