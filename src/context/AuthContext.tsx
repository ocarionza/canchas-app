import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginInDTO } from "../dtos/LoginInDTO";
import { LoginOutDTO } from "../dtos/LoginOutDTO";
import { RegisterInDTO } from "../dtos/RegisterInDTO";
import ApiClient from "../services/ApiClient";
import { secureStoreService } from "../services/SecureStoreService";

interface AuthUser {
  nombre: string;
  correo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginInDTO) => Promise<void>;
  register: (data: RegisterInDTO) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = await secureStoreService.getToken();
      const savedUser = await secureStoreService.getUser();
      if (token && savedUser) {
        setUser(savedUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginInDTO) => {
    const response = await ApiClient.post<LoginOutDTO>("/auth/login", data);
    await secureStoreService.saveToken(response.token);
    await secureStoreService.saveUser({
      nombre: response.nombre,
      correo: response.correo,
    });
    setUser({ nombre: response.nombre, correo: response.correo });
  };

  const register = async (data: RegisterInDTO) => {
    const response = await ApiClient.post<LoginOutDTO>("/auth/register", data);
    await secureStoreService.saveToken(response.token);
    await secureStoreService.saveUser({
      nombre: response.nombre,
      correo: response.correo,
    });
    setUser({ nombre: response.nombre, correo: response.correo });
  };

  const logout = async () => {
    await secureStoreService.removeToken();
    await secureStoreService.removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
