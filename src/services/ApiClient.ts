import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { secureStoreService } from "./SecureStoreService";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async buildAuthHeaders(
    useToken: boolean,
  ): Promise<AxiosRequestConfig["headers"]> {
    if (!useToken) return {};
    const token = await secureStoreService.getToken();
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public async get<T>(
    endpoint: string,
    useToken = false,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, {
        ...config,
        headers: {
          ...(await this.buildAuthHeaders(useToken)),
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  public async post<T>(
    endpoint: string,
    body: unknown,
    useToken = false,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, body, {
        ...config,
        headers: {
          ...(await this.buildAuthHeaders(useToken)),
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  public async put<T>(
    endpoint: string,
    body: unknown,
    useToken = false,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(endpoint, body, {
        ...config,
        headers: {
          ...(await this.buildAuthHeaders(useToken)),
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  public async patch<T>(
    endpoint: string,
    body: unknown,
    useToken = false,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.patch<T>(endpoint, body, {
        ...config,
        headers: {
          ...(await this.buildAuthHeaders(useToken)),
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error);
      throw error;
    }
  }

  public async delete<T>(
    endpoint: string,
    useToken = false,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.delete<T>(endpoint, {
        ...config,
        headers: {
          ...(await this.buildAuthHeaders(useToken)),
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
}

export default new ApiClient();
