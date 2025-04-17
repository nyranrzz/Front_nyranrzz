import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const KEYS = {
  AUTH_TOKEN: '@MarketApp:authToken',
  USER_DATA: '@MarketApp:userData',
};

// Store authentication token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

// Get authentication token
export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Remove authentication token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Store user data
export const storeUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(KEYS.USER_DATA, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Get user data
export const getStoredUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

// Remove user data
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DATA);
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

// Clear all app data
export const clearAllData = async () => {
  try {
    const keys = [KEYS.AUTH_TOKEN, KEYS.USER_DATA];
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
}; 