import { api } from './api';

export interface TestResult {
  id: string;
  patientId: string;
  patientName?: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  prescribingDoctorId?: string;
  prescribingDoctorName?: string;
  sentToDoctorAt?: string;
  doctorResponse?: {
    notes: string;
    prescription: string;
    requestAppointment: boolean;
    respondedAt: string;
  };
}

export interface DoctorResponse {
  notes: string;
  prescription: string;
  requestAppointment: boolean;
}

export const resultsService = {
  async uploadResults(file: File, doctorId?: string): Promise<TestResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (doctorId) formData.append('doctorId', doctorId);
    
    return api.upload('/upload_results', formData);
  },

  async getPatientResults(): Promise<TestResult[]> {
    // Mock data for testing - will be replaced by real API
    if (!import.meta.env.VITE_API_URL) {
      return [
        {
          id: '1',
          patientId: 'patient1',
          fileName: 'Blood Test Results - January 2024.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          doctorResponse: {
            notes: 'Your blood test results look generally good. However, I noticed your cholesterol levels are slightly elevated (LDL: 145 mg/dL). I recommend:\n\n1. Increase physical activity to at least 30 minutes daily\n2. Reduce saturated fat intake\n3. Add more fiber-rich foods to your diet\n4. We should retest in 3 months to monitor progress',
            prescription: 'Atorvastatin 10mg - Take one tablet daily at bedtime\nOmega-3 Fish Oil 1000mg - Take one capsule twice daily with meals\n\nDuration: 90 days\nRefills: 2',
            requestAppointment: true,
            respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: '2',
          patientId: 'patient1',
          fileName: 'X-Ray Chest - December 2023.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          doctorResponse: {
            notes: 'The chest X-ray appears normal. No signs of infection, inflammation, or abnormal masses detected. The lungs are clear and the heart size is within normal limits.\n\nYour persistent cough is likely due to seasonal allergies rather than any lung condition. Continue with the allergy medication as prescribed.',
            prescription: 'Cetirizine 10mg - Take one tablet daily in the evening\nFluticasone nasal spray - Use 2 sprays in each nostril once daily\n\nDuration: 30 days\nRefills: 1',
            requestAppointment: false,
            respondedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: '3',
          patientId: 'patient1',
          fileName: 'Annual Physical Exam - November 2023.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    return api.get('/patient/results');
  },

  async sendResultsToDoctor(resultId: string, doctorId: string): Promise<void> {
    return api.post('/patient/send_results', { resultId, doctorId });
  },

  async getDoctorPatients(): Promise<TestResult[]> {
    // Mock data for testing
    if (!import.meta.env.VITE_API_URL) {
      return [
        {
          id: '1',
          patientId: 'patient-1',
          patientName: 'John Smith',
          fileName: 'Blood Test Results - January 2024.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          patientId: 'patient-2',
          patientName: 'Emily Davis',
          fileName: 'Chest X-Ray - February 2024.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          patientId: 'patient-3',
          patientName: 'Michael Brown',
          fileName: 'MRI Scan Report - January 2024.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          patientId: 'patient-4',
          patientName: 'Sarah Wilson',
          fileName: 'Annual Physical Examination - December 2023.pdf',
          fileUrl: '#',
          uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    return api.get('/doctor/patients');
  },

  async respondToResults(resultId: string, response: DoctorResponse): Promise<void> {
    return api.post('/doctor/respond', { resultId, ...response });
  },
};
