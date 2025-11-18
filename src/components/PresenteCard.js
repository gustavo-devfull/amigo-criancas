import React, { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';

const PresenteCard = ({ presente, onEdit, onDelete }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  
  // Determinar o nome do presente
  const nomePresente = presente.nome || 'Presente';
  
  // Determinar a descrição
  const descricao = presente.descricao || '';
  
  // Verificar se é um link
  const isLink = presente.tipo === 'link' && presente.link;
  
  // Verificar se tem imagem
  const temImagem = presente.tipo === 'upload' && presente.imagemStorage;
  const imagemSrc = temImagem ? presente.imagemStorage : null;

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      {/* Ícone de editar fora do card, acima e à direita */}
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
          transition: 'all 0.2s'
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
      
      <Card 
        style={{ 
          width: '100%',
          border: '0.5px solid #ffffff',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
      <Card.Body style={{ padding: '1rem', position: 'relative' }}>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem'
        }}>
          {/* Coluna 1: Foto */}
            {temImagem && (
            <div 
              style={{ 
                flexShrink: 0, 
                width: '100px',
                height: '100px',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setShowLightbox(true)}
            >
              <img 
                src={imagemSrc}
                alt={nomePresente}
                  style={{ 
                    width: '100%',
                    height: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

          {/* Coluna 2: Nome e Observação */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isLink ? (
              <>
                <Card.Title 
                  style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: '#212529',
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}
                >
                  {nomePresente || 'Link'}
                </Card.Title>
                    <a 
                      href={presente.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                    color: '#0d6efd',
                        textDecoration: 'none', 
                    display: 'flex',
                        alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    marginBottom: descricao ? '0.5rem' : 0
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                  Link Online
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
                </a>
              </>
            ) : (
              <Card.Title 
                style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  color: '#212529',
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
                  color: '#6c757d',
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
                color: '#6c757d',
                textAlign: 'center',
                marginTop: '0.5rem',
                paddingTop: '0.5rem'
              }}>
                Sugestão sem link online.
              </div>
            )}
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

