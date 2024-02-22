import { afterAll, beforeAll, describe, it } from 'vitest';
import request from 'supertest';

import { app } from '../src/app';

describe('Transactions Routes ', () => {
  
  beforeAll(async () => {
    await app.ready()
  });

  afterAll(async () => {
    await app.close()
  });

  it('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  });

})