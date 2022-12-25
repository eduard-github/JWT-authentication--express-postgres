import request from "supertest"
import { Express } from 'express-serve-static-core'

import { createServer } from '../utils/server'

let server: Express

beforeAll(async () => {
  server = await createServer()
})

describe('GET /users/:userId', () => {
  it('responds with json', async function() {
    const res = await request(server)
      .get('/users/b9d5c6a1-9040-478f-bc2c-bedf5ccd4293')
      .set('Accept', 'application/json')
    // expect(res.headers["Content-Type"]).toMatch(/json/);
    expect(res.status).toEqual(200);
    expect(res.body.pid).toEqual(1);
  });
});

describe('GET /users/:userId', () => {
  it('responds with json', async function() {
    const res = await request(server)
      .get('/users/b9d5c6a1-9040-478f-bc5c-bedf4ccd4293')
      .set('Accept', 'application/json')
    // expect(res.headers["Content-Type"]).toMatch(/json/);
    expect(res.status).toEqual(404);
  });
});

describe('GET /users', () => {
  it('responds with json', async function() {
    const res = await request(server)
      .get('/users')
      .set('Accept', 'application/json')
    // expect(res.headers["Content-Type"]).toMatch(/json/);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
  });
});


