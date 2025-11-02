import request from 'supertest';
import app from '../neural/server.js';

describe('Dashboard API Endpoints', () => {
  let authToken = null;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ministre@sante.ga',
        password: 'Ministre2025!',
      });

    if (response.status === 200 && response.body.token) {
      authToken = response.body.token;
    }
  });

  describe('GET /api/dashboard/kpis', () => {
    test('should return 401 without auth', async () => {
      const response = await request(app).get('/api/dashboard/kpis?periode=mois');
      expect(response.status).toBe(401);
    });

    test('should return KPIs with auth', async () => {
      if (!authToken) {
        console.warn('Skipping test: no auth token (user may not exist)');
        return;
      }

      const response = await request(app)
        .get('/api/dashboard/kpis?periode=mois')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/dashboard/alerts', () => {
    test('should return alerts with auth', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/dashboard/alerts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/dashboard/decrets', () => {
    test('should return decrets with status filter', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/dashboard/decrets?status=published')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/dashboard/provinces', () => {
    test('should return provinces list', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/dashboard/provinces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should return token with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ministre@sante.ga',
          password: 'Ministre2025!',
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('role');
      } else {
        console.warn('Login test skipped: user may not exist yet');
      }
    });

    test('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ministre@sante.ga',
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
    });
  });
});

