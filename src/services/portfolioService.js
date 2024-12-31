import { auth } from '../config/firebase';
import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from '@firebase/firestore';
import { db } from '../config/firebase';

const API_URL = 'http://localhost:8000/api';

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  return user.getIdToken();
}

async function fetchWithAuth(url, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Something went wrong');
  }

  return response.json();
}

export const portfolioService = {
  // Guardar las API keys de Binance
  async saveBinanceKeys(userId, keys) {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, { binanceKeys: keys }, { merge: true });
  },

  // Obtener las API keys de Binance
  async getBinanceKeys(userId) {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists() ? docSnap.data().binanceKeys : null;
  },

  // Agregar un activo al portafolio manual
  async addManualAsset(userId, asset) {
    const assetRef = doc(collection(db, 'portfolios', userId, 'assets'));
    await setDoc(assetRef, {
      ...asset,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  // Obtener todos los activos del portafolio manual
  async getManualAssets(userId) {
    const assetsRef = collection(db, 'portfolios', userId, 'assets');
    const querySnapshot = await getDocs(assetsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Eliminar un activo del portafolio manual
  async deleteManualAsset(userId, assetId) {
    const assetRef = doc(db, 'portfolios', userId, 'assets', assetId);
    await deleteDoc(assetRef);
  },

  // Actualizar un activo del portafolio manual
  async updateManualAsset(userId, assetId, updates) {
    const assetRef = doc(db, 'portfolios', userId, 'assets', assetId);
    await updateDoc(assetRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Obtener todos los activos del portafolio
  async getPortfolio() {
    return fetchWithAuth('/portfolio');
  },

  // Agregar un activo al portafolio
  async addAsset(asset) {
    return fetchWithAuth('/portfolio/asset', {
      method: 'POST',
      body: JSON.stringify({
        symbol: asset.symbol,
        quantity: parseFloat(asset.quantity),
        average_price: parseFloat(asset.averagePrice),
        notes: asset.notes
      })
    });
  },

  // Eliminar un activo del portafolio
  async deleteAsset(symbol) {
    return fetchWithAuth(`/portfolio/asset/${symbol}`, {
      method: 'DELETE'
    });
  }
};
