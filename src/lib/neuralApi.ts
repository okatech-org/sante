import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class NeuralAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async login(credentials: any) {
    const response = await this.client.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async getMyProfile() {
    const response = await this.client.get('/patients/me');
    return response.data.profile;
  }

  async updateMyProfile(updates: any) {
    const response = await this.client.put('/patients/me', updates);
    return response.data.profile;
  }

  async verifyInsurance() {
    const response = await this.client.post('/patients/me/verify-insurance');
    return response.data.insurance;
  }

  async getMyDMP() {
    const response = await this.client.get('/patients/me/dmp');
    return response.data.dmp;
  }

  async addMedicalHistory(data: any) {
    const response = await this.client.post('/patients/me/medical-history', data);
    return response.data.history;
  }

  async addVaccination(data: any) {
    const response = await this.client.post('/patients/me/vaccinations', data);
    return response.data.vaccination;
  }

  async searchProfessionals(filters: any = {}) {
    const response = await this.client.get('/professionals/search', { params: filters });
    return response.data.professionals;
  }

  async getProfessionalProfile(professionalId: string) {
    const response = await this.client.get(`/professionals/${professionalId}`);
    return response.data.professional;
  }

  async createAppointment(appointmentData: any) {
    const response = await this.client.post('/appointments', appointmentData);
    return response.data.appointment;
  }

  async getMyAppointments(filters: any = {}) {
    const response = await this.client.get('/appointments/me', { params: filters });
    return response.data.appointments;
  }

  async cancelAppointment(appointmentId: string, reason: string) {
    const response = await this.client.post(`/appointments/${appointmentId}/cancel`, { reason });
    return response.data;
  }

  async confirmAppointment(appointmentId: string) {
    const response = await this.client.post(`/appointments/${appointmentId}/confirm`);
    return response.data;
  }

  async getNotifications(limit: number = 20) {
    const response = await this.client.get('/notifications', { params: { limit } });
    return response.data.notifications;
  }

  async markNotificationAsRead(notificationId: string) {
    const response = await this.client.put(`/notifications/${notificationId}/read`);
    return response.data.notification;
  }

  async healthCheck() {
    const response = await this.client.get('/', {
      baseURL: API_BASE_URL.replace('/api', '')
    });
    return response.data;
  }
}

export const neuralApi = new NeuralAPI();
export default neuralApi;
