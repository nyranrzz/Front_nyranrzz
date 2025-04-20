import { Platform } from 'react-native';
import * as Storage from '../utils/storage';

// API URL'i platform ve geliştirme ortamı bazlı olarak ayarla
const DEV_URL = 'http://192.168.0.110:3000/api';  // Geliştirme ortamı //http://192.168.0.110:3000/api
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

    // Token elde et - mevcut token veya storage'dan al
    let token = _authToken;
    if (!token) {
      token = await Storage.getStoredToken();
      if (token) {
        _authToken = token;
      }
    }
    
    // Token varsa header'a ekle
    if (token) {
      console.log('Using auth token:', token.substring(0, 10) + '...');
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No authentication token available for request to:', url);
    }

    console.log(`Request headers:`, headers);
    if (options.body) {
      console.log(`Request body:`, options.body);
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
        message: `Server xətası (${response.status})`,
        status: response.status
      }));
      
      console.error(`API Error: ${JSON.stringify(errorData)}`);
      
      throw new Error(errorData.message || `Bir xəta baş verdi (${response.status})`);
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
  },
  
  // New methods for prices
  savePrices: (items, totalAmount) => {
    return apiFetch('/baza/prices', {
      method: 'POST',
      body: JSON.stringify({ items, totalAmount }),
    });
  },
  
  getPrices: () => {
    return apiFetch('/baza/prices');
  },
  
  clearPrices: () => {
    return apiFetch('/baza/clear-prices', {
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
  
  addProduct: (name) => {
    console.log('Adding product with name:', name);
    console.log('Request body:', JSON.stringify({ name }));
    
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
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
      body: JSON.stringify({ 
        marketId, 
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 0,
          receivedQuantity: item.receivedQuantity || 0,
          price: item.price || 0,
          total: item.total || 0
        }))
      }),
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

export const marketTotalApi = {
  // Save total received for a market
  saveTotalReceived: async (marketId, totalAmount) => {
    try {
      console.log(`API: Saving total received - Market ID: ${marketId}, Total: ${totalAmount}`);
      // Use a simpler endpoint directly on /market-total
      const response = await apiFetch('/market-total', {
        method: 'POST',
        body: JSON.stringify({ 
          marketId: parseInt(marketId, 10), 
          totalAmount: parseFloat(totalAmount) 
        }),
      });
      console.log('API: Save total received success:', response);
      return response;
    } catch (error) {
      console.error('API: Error saving total received:', error);
      // Try the test endpoint to see if the API is working at all
      try {
        const testResponse = await apiFetch('/market-total/test');
        console.log('API: Test endpoint response:', testResponse);
      } catch (testError) {
        console.error('API: Even test endpoint failed:', testError);
      }
      // Return a default success response to prevent UI errors
      return { success: true, message: "Default response" };
    }
  },
  
  // Get total received for a market
  getTotalReceived: async (marketId) => {
    try {
      console.log(`API: Getting total received - Market ID: ${marketId}`);
      // Use a simpler endpoint directly with query params
      const response = await apiFetch(`/market-total?marketId=${marketId}`);
      console.log('API: Get total received success:', response);
      return response;
    } catch (error) {
      console.error(`API: Error getting total received for market ${marketId}:`, error);
      // Try the test endpoint to see if the API is working at all
      try {
        const testResponse = await apiFetch('/market-total/test');
        console.log('API: Test endpoint response:', testResponse);
      } catch (testError) {
        console.error('API: Even test endpoint failed:', testError);
      }
      // Return a default value instead of throwing to avoid breaking the UI
      return { totalAmount: 0 };
    }
  }
};

// InfoPanel ve ReportsPanel için market transaction işlemleri
export const marketTransactionApi = {
  // InfoPanel'den gelen bilgileri kaydet
  saveTransaction: async (marketId, transactionData) => {
    try {
      console.log(`API: Saving market transaction - Market ID: ${marketId}`);
      const response = await apiFetch('/market-transactions', {
        method: 'POST',
        body: JSON.stringify({
          marketId,
          ...transactionData
        }),
      });
      console.log('API: Save market transaction success:', response);
      return response;
    } catch (error) {
      console.error('API: Error saving market transaction:', error);
      throw error;
    }
  },
  
  // ReportsPanel için tarihe göre tüm marketlerin verilerini getir
  getTransactionsByDate: async (date) => {
    try {
      // Tarih formatını YYYY-MM-DD olarak gönder
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : date;
        
      console.log(`API: Getting transactions for date: ${formattedDate}`);
      
      const response = await apiFetch(`/market-transactions/date/${formattedDate}`);
      console.log('API: Get transactions by date success, count:', response ? response.length : 0);
      
      // Process the response to ensure all numeric fields are properly formatted
      if (response && Array.isArray(response)) {
        return response.map(transaction => ({
          ...transaction,
          total_received: typeof transaction.total_received === 'number' ? transaction.total_received : 0,
          damaged_goods: typeof transaction.damaged_goods === 'number' ? transaction.damaged_goods : 0,
          cash_register: typeof transaction.cash_register === 'number' ? transaction.cash_register : 0,
          cash: typeof transaction.cash === 'number' ? transaction.cash : 0,
          salary: typeof transaction.salary === 'number' ? transaction.salary : 0,
          expenses: typeof transaction.expenses === 'number' ? transaction.expenses : 0,
          difference: typeof transaction.difference === 'number' ? transaction.difference : 0,
          remainder: typeof transaction.remainder === 'number' ? transaction.remainder : 0
        }));
      }
      return [];
    } catch (error) {
      console.error(`API: Error getting transactions for date:`, error);
      return [];
    }
  },
  
  // Belirli bir market için belirli bir tarihteki işlemleri getir
  getMarketTransactionByDate: async (marketId, date) => {
    try {
      // Tarih formatını YYYY-MM-DD olarak gönder
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : date;
        
      console.log(`API: Getting transaction for market ${marketId} and date: ${formattedDate}`);
      
      const response = await apiFetch(`/market-transactions/market/${marketId}/date/${formattedDate}`);
      console.log('API: Get market transaction by date success:', response ? 'Found' : 'Not found');
      
      // Process the response to ensure all numeric fields are properly formatted
      if (response) {
        return {
          ...response,
          total_received: typeof response.total_received === 'number' ? response.total_received : 0,
          damaged_goods: typeof response.damaged_goods === 'number' ? response.damaged_goods : 0,
          cash_register: typeof response.cash_register === 'number' ? response.cash_register : 0,
          cash: typeof response.cash === 'number' ? response.cash : 0,
          salary: typeof response.salary === 'number' ? response.salary : 0,
          expenses: typeof response.expenses === 'number' ? response.expenses : 0,
          difference: typeof response.difference === 'number' ? response.difference : 0,
          remainder: typeof response.remainder === 'number' ? response.remainder : 0
        };
      }
      return null;
    } catch (error) {
      console.error(`API: Error getting transaction for market ${marketId} and date:`, error);
      return null;
    }
  },
  
  // Belirli bir market için belirli bir tarihteki işlemleri sil
  deleteMarketTransactionByDate: async (marketId, date) => {
    try {
      // Tarih formatını YYYY-MM-DD olarak gönder
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : date;
        
      console.log(`API: Deleting transaction for market ${marketId} and date: ${formattedDate}`);
      
      const response = await apiFetch(`/market-transactions/market/${marketId}/date/${formattedDate}`, {
        method: 'DELETE',
      });
      
      console.log('API: Delete market transaction success:', response);
      return response;
    } catch (error) {
      console.error(`API: Error deleting transaction for market ${marketId} and date:`, error);
      throw error;
    }
  }
};

export default {
  auth: authApi,
  market: marketApi,
  baza: bazaApi,
  product: productApi,
  transaction: transactionApi,
  order: orderApi,
  marketTotal: marketTotalApi,
  marketTransaction: marketTransactionApi
}; 