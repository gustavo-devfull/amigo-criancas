import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadImageToFTP } from './ftpService';

const PRESENTES_COLLECTION = 'presentes';

// Buscar todos os presentes
export const getPresentes = async () => {
  try {
    const q = query(
      collection(db, PRESENTES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    throw error;
  }
};

// Adicionar novo presente
export const addPresente = async (presenteData) => {
  try {
    const docRef = await addDoc(collection(db, PRESENTES_COLLECTION), {
      ...presenteData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar presente:', error);
    throw error;
  }
};

// Atualizar presente existente
export const updatePresente = async (id, presenteData) => {
  try {
    const presenteRef = doc(db, PRESENTES_COLLECTION, id);
    await updateDoc(presenteRef, presenteData);
  } catch (error) {
    console.error('Erro ao atualizar presente:', error);
    throw error;
  }
};

// Deletar presente
export const deletePresente = async (id) => {
  try {
    await deleteDoc(doc(db, PRESENTES_COLLECTION, id));
  } catch (error) {
    console.error('Erro ao deletar presente:', error);
    throw error;
  }
};

// Marcar/desmarcar presente como comprado
export const toggleComprado = async (id, comprado) => {
  try {
    const presenteRef = doc(db, PRESENTES_COLLECTION, id);
    await updateDoc(presenteRef, { comprado: comprado });
  } catch (error) {
    console.error('Erro ao atualizar status de comprado:', error);
    throw error;
  }
};

// Upload de imagem via FTP - salva em public_html/presentes/[amigo]
// O nome do arquivo será alterado para Amigo_N.extensão
export const uploadImage = async (file, amigo) => {
  try {
    const imageUrl = await uploadImageToFTP(file, amigo);
    return imageUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};

// Migração: atualizar nome do amigo de "GAEL" para "Gael"
export const migrarGael = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRESENTES_COLLECTION));
    const updates = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.amigo === 'GAEL') {
        updates.push(
          updateDoc(doc(db, PRESENTES_COLLECTION, docSnapshot.id), {
            amigo: 'Gael'
          })
        );
      }
    });
    
    await Promise.all(updates);
    console.log(`Migração concluída: ${updates.length} presente(s) atualizado(s)`);
    return updates.length;
  } catch (error) {
    console.error('Erro ao migrar presentes do GAEL:', error);
    throw error;
  }
};

