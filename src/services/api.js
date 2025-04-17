import { Platform } from 'react-native';
import * as Storage from '../utils/storage';

// API URL'i platform ve geliştirme ortamı bazlı olarak ayarla
const DEV_URL = 'http://192.168.0.110:3000/api';  // Geliştirme ortamı
const PROD_URL = 'http://192.168.0.110:3000/api'; // Üretim ortamı - gerekirse değiştirin

export const API_URL = __DEV__ ? DEV_URL : PROD_URL;

console.log(`App started with API_URL: ${API_URL}, Platform: ${Platform.OS}`);

// In-memory cache for performance
let _authToken = null;
let _userData = null;

// Initialize from AsyncStorage
const initializeFromStorage = async () => {
  try {
    const token = await Storage.getStoredToken();
    const userData = await Storage.getStoredUserData();
    
    if (token) _authToken = token;
    if (userData) _userData = userData;
    
    return { token, userData };
  } catch (error) {
    console.error('Error initializing from storage:', error);
    return { token: null, userData: null };
  }
};

// Initialize on module load
initializeFromStorage();

// Temel fetch işlevi
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    console.log(`Fetching from: ${url}`);
    
    // Varsayılan headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Token varsa ekle
    if (_authToken) {
      headers['Authorization'] = `Bearer ${_authToken}`;
    } else {
      // Try to get from storage if not in memory
      const token = await Storage.getStoredToken();
      if (token) {
        _authToken = token;
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    console.log(`Request headers: ${JSON.stringify(headers)}`);
    if (options.body) {
      console.log(`Request body: ${options.body}`);
    }

    // Fetch isteği
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`Response status: ${response.status}`);
    
    // Yanıtı kontrol et
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Server xətası',
        status: response.status
      }));
      
      console.error(`API Error: ${JSON.stringify(errorData)}`);
      
      throw new Error(errorData.message || 'Bir xəta baş verdi');
    }

    return response.json();
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

// Token yönetimi - AsyncStorage kullanarak
export const setToken = async (token) => {
  _authToken = token;
  return await Storage.storeToken(token);
};

export const getToken = async () => {
  if (_authToken) return _authToken;
  const token = await Storage.getStoredToken();
  _authToken = token;
  return token;
};

export const clearToken = async () => {
  _authToken = null;
  return await Storage.removeToken();
};

// Kullanıcı bilgisi yönetimi - AsyncStorage kullanarak
export const setUserInfo = async (user) => {
  _userData = user;
  return await Storage.storeUserData(user);
};

export const getUserInfo = async () => {
  if (_userData) return _userData;
  const userData = await Storage.getStoredUserData();
  _userData = userData;
  return userData;
};

export const clearUserInfo = async () => {
  _userData = null;
  return await Storage.removeUserData();
};

// API endpoint'leri
export const authApi = {
  login: async (email, password) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Login başarılıysa token ve kullanıcı bilgilerini sakla
    if (response.token && response.user) {
      await setToken(response.token);
      await setUserInfo(response.user);
    }
    
    return response;
  },
  
  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    await clearToken();
    await clearUserInfo();
  },
  
  getProfile: () => {
    return apiFetch('/auth/profile');
  },
  
  changePassword: (currentPassword, newPassword) => {
    return apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

export const marketApi = {
  getAllMarkets: () => {
    return apiFetch('/market');
  },
  
  getMarketById: (id) => {
    return apiFetch(`/market/${id}`);
  },
  
  getMarketTransactions: (id) => {
    return apiFetch(`/market/${id}/transactions`);
  },
};

export const bazaApi = {
  approveMarket: (marketId, data) => {
    return apiFetch(`/baza/approve/${marketId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getOrders: () => {
    return apiFetch('/baza/orders');
  },

  getOrderById: (orderId) => {
    return apiFetch(`/baza/orders/${orderId}`);
  },

  approveOrder: (orderId, items) => {
    return apiFetch(`/baza/approve/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },
  
  clearAllOrders: () => {
    return apiFetch('/baza/clear-orders', {
      method: 'POST',
    });
  }
};

export const productApi = {
  getAllProducts: () => {
    return apiFetch('/products');
  },
  
  getProductById: (id) => {
    return apiFetch(`/products/${id}`);
  },
};

export const transactionApi = {
  createTransaction: (data) => {
    return apiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getTransactionsByMarketId: (marketId) => {
    return apiFetch(`/transactions/market/${marketId}`);
  },
};

export const orderApi = {
  createOrder: (marketId, items) => {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ marketId, items }),
    });
  },
  
  getOrderById: (orderId) => {
    return apiFetch(`/orders/${orderId}`);
  },
  
  getOrdersByMarketId: (marketId) => {
    return apiFetch(`/orders/market/${marketId}`);
  },
  
  clearMarketOrders: (marketId) => {
    return apiFetch(`/orders/clear/${marketId}`, {
      method: 'POST'
    });
  },
  
  getUserOrders: (marketId) => {
    return apiFetch(`/orders/user/${marketId}`);
  },
  
  // New draft order methods
  saveDraftOrders: (marketId, items) => {
    return apiFetch('/draft-orders', {
      method: 'POST',
      body: JSON.stringify({ marketId, items }),
    });
  },
  
  getDraftOrdersByMarketId: (marketId) => {
    return apiFetch(`/draft-orders/market/${marketId}`);
  },
  
  clearDraftOrders: (marketId) => {
    return apiFetch(`/draft-orders/market/${marketId}`, {
      method: 'DELETE',
    });
  }
};

export default {
  auth: authApi,
  market: marketApi,
  baza: bazaApi,
  product: productApi,
  transaction: transactionApi,
  order: orderApi
}; 