
const API_BASE_URL = 'http://192.168.0.26:3000';

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const getToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      return token;
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorBody = await response.json(); 
        if(response.status === 401 || response.status === 403) {
          const error = new Error('Sessão expirada. Faça login novamente!');
          (error as any).status = response.status;
          (error as any).body = errorBody;
          localStorage.clear();
          window.location.href = '/login';
          throw error;
        }
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).body = errorBody;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }

  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }


  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
