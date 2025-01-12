interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  username: string;
  password: string;
  phone_number?: string;
  address?: string;
  role: 'user' | 'admin';
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  message?: string;
  user?: {
    email: string;
    username: string;
    role: 'user' | 'admin';
  };
}

export const API_BASE_URL = 'http://localhost:8000/api';
export const STATIC_BASE_URL = `${API_BASE_URL}/static`;

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      throw error;
    }
  },
  
    register: async (userData: SignUpData): Promise<AuthResponse> => {
      try {
        // Log the request data
        console.log('Registration request data:', userData);
  
        // Clean up undefined values before sending
        const cleanedData = Object.fromEntries(
          Object.entries(userData).filter(([_, v]) => v != null && v !== '')
        );
  
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
          credentials: 'include', // Add this if you're using cookies
        });
        
        // Log the raw response
        console.log('Registration response status:', response.status);
        
        const data = await response.json();
        console.log('Registration response data:', data);
  
        if (!response.ok) {
          // Convert the error response to a more detailed error
          throw {
            status: response.status,
            data: data,
            message: data.detail || data.message || 'Registration failed'
          };
        }
        
        return data;
      } catch (error) {
        console.error('Full registration error:', error);
        // Rethrow with more context
        throw {
          originalError: error,
          message: error instanceof Error ? error.message : 'Registration failed'
        };
      }
    }
  };
  
  
  // Store tokens in localStorage
  export const storeTokens = (response: AuthResponse) => {
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    if (response.user) {
      localStorage.setItem('userData', JSON.stringify({
        name: response.user.username,
        email: response.user.email,
        role: response.user.role
      }));
    }
  };
  
  export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
  };