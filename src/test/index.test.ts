import request from "supertest"
import { Express } from 'express-serve-static-core'

import { createServer } from '../utils/server'

let server: Express

beforeAll(async () => {
  server = await createServer()
})

describe('GET /users', () => {
  it('responds with json', async function() {
    const res = await request(server)
      .get('/users')
      .set('Accept', 'application/json')
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
  });
});

describe('GET /users/:userId', () => {
  it('responds with json user', async function() {
    const res = await request(server)
      .get('/users/002d19ec-e05b-441e-bde5-4236b2c37479')
      .set('Accept', 'application/json')
    expect(res.status).toEqual(200);
    expect(res.body.pid).toEqual(1);
  });

  it('responds with 404', async function() {
    const res = await request(server)
      .get('/users/002d19ec-e05b-441e-bde5-4236b2c37478')
      .set('Accept', 'application/json')
    expect(res.status).toEqual(404);
  });

});





