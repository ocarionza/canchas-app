import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

class SecureStoreService {
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item with key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
      throw error;
    }
  }

  async saveToken(token: string): Promise<void> {
    await this.set<string>(TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return await this.get<string>(TOKEN_KEY);
  }

  async removeToken(): Promise<void> {
    await this.remove(TOKEN_KEY);
  }

  async saveUser(user: { nombre: string; correo: string }): Promise<void> {
    await this.set(USER_KEY, user);
  }

  async getUser(): Promise<{ nombre: string; correo: string } | null> {
    return await this.get(USER_KEY);
  }

  async removeUser(): Promise<void> {
    await this.remove(USER_KEY);
  }
}

export const secureStoreService = new SecureStoreService();
