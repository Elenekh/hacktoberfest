import { api } from './api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  reviews: number;
  insurance: string[];
  experience?: string;
  certifications?: string[];
  education?: string[];
  summary?: string;
  achievements?: string[];
}

export const doctorsService = {
  async getAllDoctors(filters?: { insurance?: string; specialty?: string }): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (filters?.insurance) params.append('insurance', filters.insurance);
    if (filters?.specialty) params.append('specialty', filters.specialty);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/doctors${query}`);
  },

  async getDoctorById(id: string): Promise<Doctor> {
    return api.get(`/doctors/${id}`);
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
    return api.get(`/doctors/${doctorId}/slots?date=${date}`);
  },
};
