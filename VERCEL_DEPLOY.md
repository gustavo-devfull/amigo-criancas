# Deploy no Vercel

## Configuração

O projeto está configurado para rodar no Vercel com suporte a upload de imagens via FTP.

## Arquivos importantes:

- `api/upload-ftp.js` - API route serverless para upload FTP
- `vercel.json` - Configuração do Vercel
- `src/services/ftpService.js` - Cliente que detecta automaticamente se está em produção ou desenvolvimento

## Como fazer deploy:

1. **Instalar dependências** (já feito):
   ```bash
   npm install
   ```

2. **Fazer build**:
   ```bash
   npm run build
   ```

3. **Deploy no Vercel**:
   - Conecte seu repositório GitHub ao Vercel
   - O Vercel detectará automaticamente a configuração
   - Ou use a CLI:
     ```bash
     npm i -g vercel
     vercel
     ```

## Comportamento:

- **Desenvolvimento local**: Usa `http://localhost:3001` (servidor Express)
- **Produção (Vercel)**: Usa `/api/upload-ftp` (API route serverless)

## Notas:

- A API route do Vercel funciona como serverless function
- Não precisa rodar servidor separado em produção
- O upload FTP funciona diretamente do Vercel para o servidor FTP

