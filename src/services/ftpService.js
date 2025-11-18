// Serviço para upload de imagens via FTP
// Nota: Requer um servidor backend intermediário para fazer upload FTP

const FTP_CONFIG = {
  host: '46.202.90.62',
  user: 'u715606397.ideolog.ia.br',
  password: '@Lulipop1',
  port: 21,
  basePath: '/public_html/presentes'
};

// URL do servidor backend
// Em produção (Vercel), usa a API route serverless
// Em desenvolvimento, usa o servidor local
const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Em produção no Vercel, usa caminho relativo
    return '/api/upload-ftp';
  }
  // Em desenvolvimento, usa servidor local
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
};

const BACKEND_URL = getBackendUrl();

export const uploadImageToFTP = async (file, amigo) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // O servidor vai gerar o nome baseado no amigo + contador (Amigo_N.extensão)
    formData.append('amigo', amigo || '');

    // Construir URL corretamente
    const uploadUrl = BACKEND_URL.startsWith('http') 
      ? `${BACKEND_URL}/api/upload-ftp`  // Servidor local
      : BACKEND_URL;  // API route do Vercel (já é o caminho completo)
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
    }

    const data = await response.json();
    
    // Retorna a URL pública da imagem
    // O path já vem como /presentes/[amigo]/[arquivo] (sem public_html)
    let cleanPath = data.path || '';
    
    // Remover public_html se estiver presente no path (para imagens antigas)
    if (cleanPath.includes('/public_html')) {
      cleanPath = cleanPath.replace('/public_html', '');
    }
    
    // Garantir que começa com /
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`;
    }
    
    // Remover barras duplicadas
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Usa o domínio do novo FTP
    const domain = 'https://ideolog.ia.br';
    const publicUrl = `${domain}${cleanPath}`;
    
    console.log('=== Upload FTP ===');
    console.log('Path retornado pelo servidor:', data.path);
    console.log('Path limpo:', cleanPath);
    console.log('URL final da imagem:', publicUrl);
    console.log('Nome do arquivo:', data.filename);
    console.log('==================');
    
    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload via FTP:', error);
    
    // Mensagem mais específica para erro de conexão
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Servidor backend não está rodando. Por favor, inicie o servidor em: cd server && npm start');
    }
    
    throw error;
  }
};

export default FTP_CONFIG;

