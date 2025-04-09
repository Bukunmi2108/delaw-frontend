// api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { chatHistory, ChatMessage } from '../components/chatmessagecontainer/ChatMessageContainer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Replace with your backend URL

interface Token {
  access_token: string;
  token_type: "bearer";
}

interface LoginForm {
  username: string;
  password: string;
}

interface ChatRequest {
  message: string;
  chat_id?: string | null;
}

interface CreateChatHistoryRequest {
  messages: ChatMessage[];
}

interface UpdateChatHistoryRequest {
  messages: ChatMessage[];
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = localStorage.getItem('token') || sessionStorage.getItem('token'); // Get token from storage

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token if available
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setToken(token: string | null, remember: boolean = false) {
    this.token = token;
    if (token) {
      if (remember) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token'); //Clear session storage if remember is true.
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token'); //Clear local storage if remember is false.
      }
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // Authentication Routes
  async register(userData: any) {
    return this.post('/auth/register', userData);
  }

  async login(formData: LoginForm, remember: boolean = false) {
    try {
      const response = await this.post<Token>('/auth/token', formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      this.setToken(response.access_token, remember);
      return response;
    } catch (error) {
      // Handle the error appropriately (e.g., log, throw, return)
      console.error('Login failed:', error);
      throw error; // Or return null, or a custom error object.
    }
  }

  async getUser() {
    return this.get("/users/me", { headers: {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : '',
    }});
  }

  async logout() {
    this.setToken(null);
  }

  // Chat Routes
  async chatStream(requestData: ChatRequest): Promise<Response> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
        body: JSON.stringify(requestData),
      });
      return response;
    } catch (error) {
      console.error('Error calling chat stream API:', error);
      throw error;
    }
  }

  async getChatHistory(chatId: string) {
    return this.get<chatHistory>(`/chat/history/${chatId}`);
  }

  async getAllChatHistory() {
    return this.get<chatHistory[]>(`/chat/history/all`);
  }

  async createChatHistory(data: CreateChatHistoryRequest) {
    return this.post<chatHistory>(`/chat/history`, data);
  }

  async updateChatHistory(chatId: string, data: UpdateChatHistoryRequest) {
    return this.put<chatHistory>(`/chat/history/${chatId}`, data);
  }

  async deleteChatHistory(chatId: string) {
    return this.delete(`/chat/history/${chatId}`);
  }

  async deleteAllChatHistory() {
    return this.delete(`/chat/history/all`);
  }
}

const apiService = new ApiService();
export default apiService;