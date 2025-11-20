# 🔧 Como Configurar as Regras do Firestore

O erro "Missing or insufficient permissions" ocorre porque as regras de segurança do Firestore não estão configuradas. Siga estes passos para resolver:

## 📋 Passo a Passo

### 1. Acesse o Console do Firebase

1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto **"amigo-criancas"**

### 2. Configure o Firestore Database

1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Se ainda não criou o banco de dados:
   - Clique em **"Criar banco de dados"**
   - Escolha o modo: **"Começar no modo de teste"** (para desenvolvimento)
   - Escolha a localização (ex: `southamerica-east1` para Brasil)
   - Clique em **"Ativar"**

### 3. Configure as Regras de Segurança do Firestore

1. Na página do Firestore Database, clique na aba **"Regras"** (no topo)
2. Você verá um editor de código com regras padrão
3. **Substitua** todo o conteúdo pelas regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Clique em **"Publicar"** (botão azul no topo)

### 4. Verifique se Funcionou

1. Volte para o aplicativo React
2. Recarregue a página (F5 ou Cmd+R)
3. O erro de permissões deve desaparecer

## ⚠️ Importante

- **Modo de Teste**: As regras acima permitem leitura e escrita públicas. Isso é adequado para desenvolvimento/teste.
- **Para Produção**: Se for usar em produção, configure regras de segurança mais restritivas com autenticação de usuários.

## 🆘 Ainda com Problemas?

Se o erro persistir:

1. Verifique se você está no projeto correto (`amigo-criancas`)
2. Verifique se o Firestore Database está ativado
3. Verifique se as regras foram publicadas (deve aparecer "Publicado" ao lado do botão Publicar)
4. Aguarde alguns segundos após publicar as regras (pode levar alguns instantes para propagar)

## 📸 Visualização das Regras

As regras devem ficar assim no editor:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Depois de configurar, o sistema deve funcionar normalmente! 🎉

