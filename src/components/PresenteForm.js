import React, { useState } from 'react';
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { addPresente, updatePresente, uploadImage } from '../services/presentesService';
import { AMIGOS } from '../data/amigos';

const PresenteForm = ({ show, handleClose, presente = null, amigoPreSelecionado = null, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('imagem-url');
  const [loading, setLoading] = useState(false);
  const [amigoSelecionado, setAmigoSelecionado] = useState('');
  
  // Estado para formulário com nome e descrição
  const [nomeDescricaoForm, setNomeDescricaoForm] = useState({
    nome: '',
    descricao: ''
  });
  
  // Estado para formulário com link
  const [linkForm, setLinkForm] = useState({
    link: '',
    descricao: ''
  });
  
  // Estado para formulário com upload
  const [uploadForm, setUploadForm] = useState({
    nome: '',
    descricao: '',
    imagemFile: null,
    imagemPreview: null
  });

  // Resetar formulários quando o modal abrir/fechar
  React.useEffect(() => {
    if (show) {
      if (presente) {
        // Modo edição
        setAmigoSelecionado(presente.amigo || '');
        if (presente.tipo === 'nome-descricao' || (presente.nome && presente.descricao && !presente.link && !presente.imagemStorage && !presente.imagemUrl)) {
          setNomeDescricaoForm({
            nome: presente.nome || '',
            descricao: presente.descricao || ''
          });
          setActiveTab('imagem-url');
        } else if (presente.link) {
          setLinkForm({
            link: presente.link,
            descricao: presente.descricao || ''
          });
          setActiveTab('link');
        } else if (presente.imagemStorage) {
          setUploadForm({
            nome: presente.nome || '',
            descricao: presente.descricao || '',
            imagemFile: null,
            imagemPreview: presente.imagemStorage
          });
          setActiveTab('upload');
        }
      } else {
        // Modo criação - resetar tudo
        setAmigoSelecionado(amigoPreSelecionado || '');
        setNomeDescricaoForm({ nome: '', descricao: '' });
        setLinkForm({ link: '', descricao: '' });
        setUploadForm({ nome: '', descricao: '', imagemFile: null, imagemPreview: null });
        setActiveTab('imagem-url');
      }
    }
  }, [show, presente, amigoPreSelecionado]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm({
          ...uploadForm,
          imagemFile: file,
          imagemPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
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

      if (activeTab === 'imagem-url') {
        if (!nomeDescricaoForm.nome || !nomeDescricaoForm.descricao) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        presenteData = {
          nome: nomeDescricaoForm.nome,
          descricao: nomeDescricaoForm.descricao,
          tipo: 'nome-descricao',
          amigo: amigoSelecionado
        };
      } else if (activeTab === 'link') {
        if (!linkForm.link || !linkForm.descricao) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        presenteData = {
          link: linkForm.link,
          descricao: linkForm.descricao,
          tipo: 'link',
          amigo: amigoSelecionado
        };
      } else if (activeTab === 'upload') {
        if (!uploadForm.nome || !uploadForm.descricao || (!uploadForm.imagemFile && !uploadForm.imagemPreview)) {
          alert('Por favor, preencha todos os campos');
          setLoading(false);
          return;
        }
        
        let imagemUrl = uploadForm.imagemPreview;
        
        // Se há um novo arquivo, fazer upload
        // O nome será alterado para Amigo_N.extensão no servidor
        if (uploadForm.imagemFile) {
          imagemUrl = await uploadImage(uploadForm.imagemFile, amigoSelecionado);
        }
        
        presenteData = {
          nome: uploadForm.nome,
          descricao: uploadForm.descricao,
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
        // Passar o nome do amigo para expandir o accordion
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

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="pb-3">
        <Modal.Title className="h5 h-md-4" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
          {presente ? 'Editar Presente' : 'Adicionar Presente'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 px-md-4 py-4">
        <Form.Group className="mb-3">
          <Form.Label>Amigo</Form.Label>
          <Form.Select
            value={amigoSelecionado}
            onChange={(e) => setAmigoSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um amigo</option>
            {AMIGOS.map((amigo) => (
              <option key={amigo} value={amigo}>
                {amigo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="imagem-url" title="Nome e Descrição">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome do Presente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do presente"
                  value={nomeDescricaoForm.nome}
                  onChange={(e) => setNomeDescricaoForm({ ...nomeDescricaoForm, nome: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Descreva o presente..."
                  value={nomeDescricaoForm.descricao}
                  onChange={(e) => setNomeDescricaoForm({ ...nomeDescricaoForm, descricao: e.target.value })}
                  required
                />
              </Form.Group>
            </Form>
          </Tab>

          <Tab eventKey="link" title="Link e Descrição">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Link do Presente</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://exemplo.com/produto"
                  value={linkForm.link}
                  onChange={(e) => setLinkForm({ ...linkForm, link: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Descreva o presente..."
                  value={linkForm.descricao}
                  onChange={(e) => setLinkForm({ ...linkForm, descricao: e.target.value })}
                  required
                />
              </Form.Group>
            </Form>
          </Tab>

          <Tab eventKey="upload" title="Presente e Foto">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome do Presente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do presente"
                  value={uploadForm.nome}
                  onChange={(e) => setUploadForm({ ...uploadForm, nome: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Descreva o presente..."
                  value={uploadForm.descricao}
                  onChange={(e) => setUploadForm({ ...uploadForm, descricao: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Imagem</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  required={!uploadForm.imagemPreview}
                />
                {uploadForm.imagemPreview && (
                  <div className="mt-2">
                    <img 
                      src={uploadForm.imagemPreview} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </Form.Group>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column flex-md-row gap-2 gap-md-0">
        <Button 
          variant="secondary" 
          onClick={handleClose} 
          disabled={loading}
          className="w-100 w-md-auto order-2 order-md-1"
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-100 w-md-auto order-1 order-md-2"
        >
          {loading ? 'Salvando...' : (presente ? 'Atualizar' : 'Adicionar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PresenteForm;

