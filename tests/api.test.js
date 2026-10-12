import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server/app.js';

describe('API Security & Unauthenticated Requests', () => {
  it('GET /api/health should return 200 ok and service info', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'StudySpace API');
  });

  it('GET /api/unknown-endpoint should return 404 with structured error', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /not found/i);
  });

  it('GET /api/notes should reject unauthorized requests with 401', async () => {
    const res = await request(app).get('/api/notes');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Authentication required/i);
  });

  it('GET /api/trash should reject unauthorized requests with 401', async () => {
    const res = await request(app).get('/api/trash');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('GET /api/subjects should reject unauthorized requests with 401', async () => {
    const res = await request(app).get('/api/subjects');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('GET /api/dashboard/stats should reject unauthorized requests with 401', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('POST /api/auth/login with invalid payload should return 400 validation error', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'invalid-email',
      password: '',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors);
  });

  it('POST /api/auth/register with empty name should return 400 validation error', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'valid@example.com',
      password: 'validpassword123',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors?.name);
  });
});
