import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addPresente, updatePresente, uploadImage } from '../services/presentesService';
import { AMIGOS } from '../data/amigos';

const PresenteForm = ({ show, handleClose, presente = null, amigoPreSelecionado = null, onSuccess }) => {
  const [tipoMidia, setTipoMidia] = useState('nenhum'); // 'nenhum', 'link', 'upload'
  const [loading, setLoading] = useState(false);
  const [amigoSelecionado, setAmigoSelecionado] = useState('');
  
  // Estado unificado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    link: '',
    imagemFile: null,
    imagemPreview: null
  });

  // Resetar formulário quando o modal abrir/fechar
  React.useEffect(() => {
    if (show) {
      if (presente) {
        // Modo edição
        setAmigoSelecionado(presente.amigo || '');
        if (presente.link) {
          setTipoMidia('link');
          setFormData({
            nome: '',
            descricao: presente.descricao || '',
            link: presente.link || '',
            imagemFile: null,
            imagemPreview: null
          });
        } else if (presente.imagemStorage || presente.imagemUrl) {
          setTipoMidia('upload');
          setFormData({
            nome: presente.nome || '',
            descricao: presente.descricao || '',
            link: '',
            imagemFile: null,
            imagemPreview: presente.imagemStorage || presente.imagemUrl || null
          });
        } else {
          setTipoMidia('nenhum');
          setFormData({
            nome: presente.nome || '',
            descricao: presente.descricao || '',
            link: '',
            imagemFile: null,
            imagemPreview: null
          });
        }
      } else {
        // Modo criação - resetar tudo
        setAmigoSelecionado(amigoPreSelecionado || '');
        setTipoMidia('nenhum');
        setFormData({
          nome: '',
          descricao: '',
          link: '',
          imagemFile: null,
          imagemPreview: null
        });
      }
    }
  }, [show, presente, amigoPreSelecionado]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imagemFile: file,
          imagemPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let presenteData = {};

      if (!amigoSelecionado) {
        alert('Por favor, selecione um amigo');
        setLoading(false);
        return;
      }

      if (tipoMidia === 'nenhum') {
        if (!formData.nome || !formData.descricao) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        presenteData = {
          nome: formData.nome,
          descricao: formData.descricao,
          tipo: 'nome-descricao',
          amigo: amigoSelecionado
        };
      } else if (tipoMidia === 'link') {
        if (!formData.link || !formData.descricao) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        presenteData = {
          link: formData.link,
          descricao: formData.descricao,
          tipo: 'link',
          amigo: amigoSelecionado
        };
      } else if (tipoMidia === 'upload') {
        if (!formData.nome || !formData.descricao || (!formData.imagemFile && !formData.imagemPreview)) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        
        let imagemUrl = formData.imagemPreview;
        
        // Se há um novo arquivo, fazer upload
        if (formData.imagemFile) {
          imagemUrl = await uploadImage(formData.imagemFile, amigoSelecionado);
        }
        
        presenteData = {
          nome: formData.nome,
          descricao: formData.descricao,
          imagemStorage: imagemUrl,
          tipo: 'upload',
          amigo: amigoSelecionado
        };
      }

      if (presente) {
        // Editar
        await updatePresente(presente.id, presenteData);
      } else {
        // Criar
        await addPresente(presenteData);
      }

      handleClose();
      if (onSuccess) {
        onSuccess(amigoSelecionado);
      }
    } catch (error) {
      console.error('Erro ao salvar presente:', error);
      const errorMessage = error.message || 'Erro ao salvar presente. Tente novamente.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const amigoNome = amigoSelecionado || amigoPreSelecionado || '';

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {presente ? 'Editar Presente' : 'Adicionar Presente'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-4">
        {amigoNome && (
          <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
            Adicione uma sugestão de presente para {amigoNome}.
          </p>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
              Amigo
            </Form.Label>
            <Form.Select
              value={amigoSelecionado}
              onChange={(e) => setAmigoSelecionado(e.target.value)}
              required
              disabled={!!amigoPreSelecionado}
            >
              <option value="">Selecione um amigo</option>
              {AMIGOS.map((amigo) => (
                <option key={amigo} value={amigo}>
                  {amigo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
              Nome do Presente
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Livro de Ficção"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required={tipoMidia !== 'link'}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500', marginBottom: '0.75rem' }}>
              Tipo de Mídia
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="tipo-nenhum"
                name="tipoMidia"
                label="Nenhum (Apenas texto)"
                checked={tipoMidia === 'nenhum'}
                onChange={() => setTipoMidia('nenhum')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="tipo-link"
                name="tipoMidia"
                label="Link"
                checked={tipoMidia === 'link'}
                onChange={() => setTipoMidia('link')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="tipo-upload"
                name="tipoMidia"
                label="Upload de Foto"
                checked={tipoMidia === 'upload'}
                onChange={() => setTipoMidia('upload')}
              />
            </div>
          </Form.Group>

          {tipoMidia === 'link' && (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                Link
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="https://exemplo.com/produto"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                required
              />
            </Form.Group>
          )}

          {tipoMidia === 'upload' && (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                Foto
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                required={!formData.imagemPreview}
              />
              {formData.imagemPreview && (
                <div className="mt-2">
                  <img 
                    src={formData.imagemPreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }}
                  />
                </div>
              )}
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
              Descrição / Observação
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Detalhes adicionais, tamanho, cor, etc."
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button 
          variant="secondary" 
          onClick={handleClose} 
          disabled={loading}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#000', 
            border: '1px solid #dee2e6' 
          }}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PresenteForm;

