import { api } from './api';

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientId?: string;
  patientName?: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  fee: number;
  paymentStatus?: 'pending' | 'paid';
}

export interface CreateBookingData {
  doctorId: string;
  date: string;
  time: string;
}

export const bookingsService = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    return api.post('/book', data);
  },

  async getPatientBookings(): Promise<Booking[]> {
    return api.get('/patient/bookings');
  },

  async getDoctorBookings(): Promise<Booking[]> {
    // Mock data for testing
    if (!import.meta.env.VITE_API_URL) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      return [
        {
          id: '1',
          doctorId: 'doctor-1',
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          patientId: 'patient-1',
          patientName: 'John Smith',
          date: tomorrow.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time: '10:00 AM',
          location: 'City Medical Center - Room 305',
          status: 'upcoming',
          fee: 150,
          paymentStatus: 'paid',
        },
        {
          id: '2',
          doctorId: 'doctor-1',
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          patientId: 'patient-2',
          patientName: 'Emily Davis',
          date: tomorrow.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time: '2:30 PM',
          location: 'City Medical Center - Room 305',
          status: 'upcoming',
          fee: 150,
          paymentStatus: 'pending',
        },
        {
          id: '3',
          doctorId: 'doctor-1',
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          patientId: 'patient-3',
          patientName: 'Michael Brown',
          date: nextWeek.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time: '11:15 AM',
          location: 'City Medical Center - Room 305',
          status: 'upcoming',
          fee: 150,
          paymentStatus: 'paid',
        },
      ];
    }
    return api.get('/doctor/bookings');
  },

  async cancelBooking(bookingId: string): Promise<void> {
    return api.delete(`/bookings/${bookingId}`);
  },

  async rescheduleBooking(bookingId: string, date: string, time: string): Promise<Booking> {
    return api.put(`/bookings/${bookingId}`, { date, time });
  },
};
