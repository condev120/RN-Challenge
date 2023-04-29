import AsyncStorage from '@react-native-async-storage/async-storage';

export const localService = {
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  },

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log(error);
    }
  },

  async getObjectItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : value;
    } catch (error) {
      console.log(error);
      await AsyncStorage.removeItem(key);
      return null;
    }
  },

  async remove(key) {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  },
};
