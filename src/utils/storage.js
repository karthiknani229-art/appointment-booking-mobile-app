import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'APPT_USER',
  USERS_DB: 'APPT_USERS_DB',
  APPOINTMENTS: 'APPT_APPOINTMENTS',
  TOKEN: 'APPT_TOKEN',
};

export const StorageKeys = KEYS;

export const storage = {
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage getItem error:', e);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage setItem error:', e);
      return false;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage removeItem error:', e);
      return false;
    }
  },

  async clear() {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  },
};
