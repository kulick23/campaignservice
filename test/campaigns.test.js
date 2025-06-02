const request = require('supertest');
const app = require('../index');

describe('Campaign API', () => {
  it('GET /campaigns returns 200', async () => {
    const res = await request(app).get('/campaigns');
    expect(res.statusCode).toBe(200);
  });

  it('POST /campaigns creates a campaign', async () => {
    const res = await request(app)
      .post('/campaigns')
      .send({ title: 'Test', goal: 1000 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});