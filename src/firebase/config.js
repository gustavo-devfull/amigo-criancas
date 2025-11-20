import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWJ-xIZr4vPQZJYjaYsvA-uOjGQAyOLFs",
  authDomain: "amigo-criancas.firebaseapp.com",
  projectId: "amigo-criancas",
  storageBucket: "amigo-criancas.firebasestorage.app",
  messagingSenderId: "1035408545950",
  appId: "1:1035408545950:web:0ce97ecbaee75ed442838f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);

export default app;

