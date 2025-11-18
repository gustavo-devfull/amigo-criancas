import React from 'react';
import { Card } from 'react-bootstrap';

const PresenteCard = ({ presente, onEdit, onDelete }) => {
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
    <Card 
      className="mb-2" 
      style={{ 
        width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#ffffff'
      }}
    >
      <Card.Body style={{ padding: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem'
        }}>
          {/* Coluna 1: Foto */}
          {temImagem && (
            <div style={{ flexShrink: 0 }}>
              <img 
                src={imagemSrc}
                alt={nomePresente}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
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
              <Card.Title 
                style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: descricao ? '0.5rem' : 0
                }}
              >
                <a 
                  href={presente.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#0d6efd',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {nomePresente}
                </a>
              </Card.Title>
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
                  marginBottom: 0,
                  lineHeight: '1.5'
                }}
              >
                {descricao}
              </Card.Text>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PresenteCard;

