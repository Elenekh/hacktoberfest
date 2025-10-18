import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
  age?: string;
  gender?: string;
  insurance?: string;
  specialty?: string;
  clinic?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
  age?: string;
  gender?: string;
  insurance?: string;
  specialty?: string;
  clinic?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Mock data for testing without backend
const mockUsers: User[] = [
  {
    id: 'doctor-1',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@test.com',
    role: 'doctor',
    specialty: 'Cardiology',
    clinic: 'City Medical Center',
  },
  {
    id: 'patient-1',
    name: 'John Smith',
    email: 'patient@test.com',
    role: 'patient',
    age: '35',
    gender: 'male',
    insurance: 'blue-cross',
  },
];

const useMockData = !import.meta.env.VITE_API_URL;

export const authService = {
  async register(data: RegisterData): Promise<LoginResponse> {
    if (useMockData) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        ...data,
      };
      mockUsers.push(newUser);
      return { user: newUser, token: 'mock-token-' + newUser.id };
    }
    return api.post('/register', data, { requiresAuth: false });
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    if (useMockData) {
      let user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        // Create new user if not found (for testing)
        user = {
          id: 'mock-user-' + Date.now(),
          name: 'Demo User',
          email,
          role: 'patient' as const,
          age: '30',
          gender: 'other',
          insurance: 'blue-cross',
        };
        mockUsers.push(user);
      }
      
      return { user, token: 'mock-token-' + user.id };
    }
    return api.post('/login', { email, password }, { requiresAuth: false });
  },

  async logout(): Promise<void> {
    if (useMockData) {
      return Promise.resolve();
    }
    return api.post('/logout');
  },

  async getCurrentUser(): Promise<User> {
    if (useMockData) {
      throw new Error('Not authenticated');
    }
    return api.get('/me');
  },
};
