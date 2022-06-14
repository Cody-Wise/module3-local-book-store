const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('author routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return a list of authors', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
    const mockingbird = res.body.find(
      (author) => author.name === 'F. Scott Fitzgerald'
    );
    expect(mockingbird).toHaveProperty('dob', '09/24/1896');
    expect(mockingbird).toHaveProperty('pob', 'St Paul, MN');
  });

  it('should return a single authors details', async () => {
    const res = await request(app).get('/authors/2');
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('Gabriel García Márquez');
    expect(res.body.dob).toEqual('03/06/1927');
  });

  afterAll(() => {
    pool.end();
  });
});
