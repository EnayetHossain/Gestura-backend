import request from 'supertest';
import express from 'express';
import { errorHandler } from '../src/middlewares/errorHandler.middleware';
import itemRoutes from "../src/routes/item.route"

const app = express();
app.use(express.json());
app.use('/api/v1/items', itemRoutes);
app.use(errorHandler);

let testItemId: number;

describe('Item API', () => {
  it('should create an item', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .send({ name: 'Test name' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    testItemId = res.body.id;
  });

  it('Should return all the items', async () => {
    const res = await request(app).get('/api/v1/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Should fetch one item by Id', async () => {
    const res = await request(app).get(`/api/v1/items/${testItemId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Test name');
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/v1/items/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Item not found');
  });

  it('should update an item', async () => {
    const res = await request(app)
      .put(`/api/v1/items/${testItemId}`)
      .send({ name: 'updated item' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('updated item');
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app)
      .put('/api/v1/items/333')
      .send({ name: 'updated item' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Item not found');
  });

  it('should delete an item', async () => {
    const res = await request(app).delete(`/api/v1/items/${testItemId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('deleted');
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app).delete(`/api/v1/items/${testItemId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Item not found');
  });
});
