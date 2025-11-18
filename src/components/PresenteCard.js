import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const PresenteCard = ({ presente, onEdit, onDelete }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleImageClick = (imageSrc) => {
    setLightboxImage(imageSrc);
    setShowLightbox(true);
  };

  const getImageSrc = () => {
    // Apenas tipos com imagem devem exibir foto
    if (presente.tipo === 'upload' && presente.imagemStorage) {
      return presente.imagemStorage;
    }
    if (presente.tipo === 'imagem-url' && presente.imagemUrl) {
      return presente.imagemUrl;
    }
    return null;
  };

  const imageSrc = getImageSrc();
  const temImagem = imageSrc !== null;

  return (
    <>
      <Card 
        className="mb-2 presente-card" 
        style={{ 
          width: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <Card.Body className="d-flex flex-column flex-md-row align-items-start align-items-md-center p-3 p-md-4" style={{ gap: '20px' }}>
          {/* Container principal com 70% para campos */}
          <div className="d-flex flex-column flex-md-row flex-grow-1 align-items-start align-items-md-center" style={{ gap: '16px', width: '100%', flex: '0 0 70%', minWidth: 0 }}>
            {/* FOTO - apenas se houver imagem */}
            {temImagem && (
              <div style={{ 
                flexShrink: 0, 
                width: '100%', 
                maxWidth: '160px',
                height: '160px',
                margin: '0 auto',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }} className="mb-3 mb-md-0">
                <img 
                  src={imageSrc}
                  alt={presente.nome || 'Presente'}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  onClick={() => handleImageClick(imageSrc)}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  onError={(e) => {
                    console.error('Erro ao carregar imagem. URL:', imageSrc);
                    e.target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border: 1px dashed #dee2e6; color: #6c757d; padding: 10px; text-align: center; border-radius: 8px;';
                    errorDiv.innerHTML = `<small>Erro ao carregar imagem</small>`;
                    e.target.parentNode.appendChild(errorDiv);
                  }}
                  onLoad={() => {
                    console.log('Imagem carregada com sucesso:', imageSrc);
                  }}
                />
              </div>
            )}

            {/* Conteúdo de texto */}
            <div className="d-flex flex-column flex-md-row flex-grow-1 align-items-start align-items-md-center" style={{ gap: '16px', width: '100%', minWidth: 0 }}>
              {/* Nome */}
              {presente.nome && (
                <div style={{ 
                  flex: '0 0 auto', 
                  width: '100%',
                  minWidth: '180px',
                  maxWidth: '280px'
                }} className="w-100 w-md-auto">
                  <Card.Title className="mb-1 mb-md-0" style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: '600',
                    color: '#212529',
                    lineHeight: '1.4'
                  }}>
                    {presente.nome}
                  </Card.Title>
                </div>
              )}

              {/* Descrição */}
              <div style={{ 
                flex: 1, 
                minWidth: 0,
                width: '100%'
              }} className="w-100">
                {presente.tipo === 'link' && presente.link ? (
                  // Tipo Link: exibir apenas a descrição como link
                  <Card.Text className="mb-0">
                    <a 
                      href={presente.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        fontSize: '0.95rem', 
                        textDecoration: 'none', 
                        wordBreak: 'break-word',
                        color: '#0d6efd',
                        transition: 'color 0.2s ease',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#0a58ca';
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#0d6efd';
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                      {presente.descricao || 'Ver Presente'}
                      <span style={{ fontSize: '0.85rem' }}>🔗</span>
                    </a>
                  </Card.Text>
                ) : presente.descricao ? (
                  // Outros tipos: exibir descrição normal
                  <Card.Text className="mb-0" style={{ 
                    fontSize: '0.95rem', 
                    wordBreak: 'break-word', 
                    lineHeight: '1.6',
                    color: '#495057'
                  }}>
                    {presente.descricao}
                  </Card.Text>
                ) : (
                  <Card.Text className="mb-0 text-muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Sem descrição
                  </Card.Text>
                )}
              </div>
            </div>
          </div>

          {/* Botões - 30% da largura */}
          <div className="d-flex gap-2 w-100 w-md-auto justify-content-end" style={{ flex: '0 0 30%', flexShrink: 0, maxWidth: '30%' }}>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => onEdit(presente)}
              className="flex-fill flex-md-grow-0"
              style={{ 
                whiteSpace: 'nowrap',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}
            >
              <span className="d-md-none">✏️</span>
              <span className="d-none d-md-inline">✏️ Editar</span>
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este presente?')) {
                  onDelete(presente.id);
                }
              }}
              className="flex-fill flex-md-grow-0"
              style={{ 
                whiteSpace: 'nowrap',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}
            >
              <span className="d-md-none">🗑️</span>
              <span className="d-none d-md-inline">🗑️ Excluir</span>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Lightbox Modal */}
      <Modal 
        show={showLightbox} 
        onHide={() => setShowLightbox(false)}
        size="xl"
        centered
        className="lightbox-modal"
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title style={{ fontSize: '1.25rem' }}>{presente.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {lightboxImage && (
            <img 
              src={lightboxImage} 
              alt={presente.nome}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PresenteCard;

