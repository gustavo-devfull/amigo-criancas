// API Route do Vercel para upload de imagens via FTP
// Esta função serverless substitui o servidor Express local

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const os = require('os');
const busboy = require('busboy');

// Configuração FTP
const FTP_CONFIG = {
  host: '46.202.90.62',
  user: 'u715606397.ideolog.ia.br',
  password: '@Lulipop1',
  port: 21,
  basePath: '/public_html/presentes'
};

// Função para obter a extensão do arquivo
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Função para gerar nome do arquivo baseado no amigo + contador
const generateFilename = async (client, amigo, originalFilename) => {
  const extension = getFileExtension(originalFilename);
  const amigoPath = `${FTP_CONFIG.basePath}/${amigo}`;
  
  try {
    const files = await client.list(amigoPath);
    
    const imageFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      const amigoLower = amigo.toLowerCase();
      const pattern = new RegExp(`^${amigoLower}_\\d+\\.(jpg|jpeg|png|gif|webp)$`, 'i');
      return pattern.test(fileName);
    });
    
    let nextNumber = 1;
    if (imageFiles.length > 0) {
      const amigoEscaped = amigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingNumbers = imageFiles.map(file => {
        const match = file.name.match(new RegExp(`^${amigoEscaped}_(\\d+)\\.`, 'i'));
        return match ? parseInt(match[1]) : 0;
      }).filter(num => num > 0);
      
      if (existingNumbers.length > 0) {
        nextNumber = Math.max(...existingNumbers) + 1;
      }
    }
    
    const filename = `${amigo}_${nextNumber}.${extension}`;
    console.log(`Nome gerado para ${amigo}: ${filename} (original: ${originalFilename})`);
    return filename;
  } catch (error) {
    console.log('Erro ao listar arquivos, usando número 1:', error.message);
    const filename = `${amigo}_1.${extension}`;
    console.log(`Nome gerado (fallback) para ${amigo}: ${filename}`);
    return filename;
  }
};

module.exports = async function handler(req, res) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const client = new ftp.Client();
  let tempFilePath = null;

  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    let fileBuffer = null;
    let originalFilename = 'image.jpg';
    let amigoRecebido = 'geral';

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      originalFilename = filename || 'image.jpg';
      const chunks = [];
      
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    bb.on('field', (name, value) => {
      if (name === 'amigo') {
        amigoRecebido = value;
      }
    });

    bb.on('finish', async () => {
      if (!fileBuffer) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      try {
        let amigo = amigoRecebido || 'geral';
        
        // Capitalizar primeira letra do nome do amigo
        if (amigo && amigo.length > 0) {
          amigo = amigo.charAt(0).toUpperCase() + amigo.slice(1).toLowerCase();
        }
        
        console.log(`=== Recebendo upload ===`);
        console.log(`Amigo recebido: ${amigoRecebido}`);
        console.log(`Amigo processado: ${amigo}`);
        console.log(`Arquivo original: ${originalFilename}`);

        // Criar arquivo temporário
        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `upload_${Date.now()}_${originalFilename}`);
        fs.writeFileSync(tempFilePath, fileBuffer);

        // Conectar ao FTP
        await client.access({
          host: FTP_CONFIG.host,
          user: FTP_CONFIG.user,
          password: FTP_CONFIG.password,
          port: FTP_CONFIG.port
        });

        // Criar diretório base se não existir
        try {
          await client.ensureDir(FTP_CONFIG.basePath);
        } catch (err) {
          console.log('Diretório base já existe ou erro ao criar:', err.message);
        }

        // Criar diretório do amigo se não existir
        try {
          await client.ensureDir(`${FTP_CONFIG.basePath}/${amigo}`);
        } catch (err) {
          console.log('Diretório do amigo já existe ou erro ao criar:', err.message);
        }

        // Gerar nome do arquivo
        const filename = await generateFilename(client, amigo, originalFilename);
        const remotePath = `${FTP_CONFIG.basePath}/${amigo}/${filename}`;

        console.log(`=== Upload FTP ===`);
        console.log(`Arquivo original: ${originalFilename}`);
        console.log(`Nome gerado: ${filename}`);
        console.log(`Amigo: ${amigo}`);
        console.log(`Caminho remoto: ${remotePath}`);

        // Fazer upload do arquivo
        await client.uploadFrom(tempFilePath, remotePath);

        // Fechar conexão
        client.close();

        // Deletar arquivo temporário
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }

        // Path público (sem public_html)
        const publicPath = `/presentes/${amigo}/${filename}`;
        
        console.log(`Path público retornado: ${publicPath}`);

        res.status(200).json({
          success: true,
          filename: filename,
          path: publicPath,
          amigo: amigo
        });
        
        resolve();
      } catch (error) {
        console.error('Erro no upload FTP:', error);
        
        // Limpar arquivo temporário em caso de erro
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.error('Erro ao deletar arquivo temporário:', err);
          }
        }
        
        res.status(500).json({ 
          error: 'Erro ao fazer upload da imagem',
          message: error.message 
        });
        
        reject(error);
      }
    });

    bb.on('error', (err) => {
      console.error('Erro no busboy:', err);
      res.status(500).json({ 
        error: 'Erro ao processar formulário',
        message: err.message 
      });
      reject(err);
    });

    req.pipe(bb);
  });
};
