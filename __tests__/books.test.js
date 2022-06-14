const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('book routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return a list of books', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
    const gatsby = res.body.find((book) => book.title === 'The Great Gatsby');
    expect(gatsby).toHaveProperty('released', 1925);
  });

  it('should return a single authors details', async () => {
    const res = await request(app).get('/books/2');
    expect(res.status).toBe(200);
    expect(res.body.title).toEqual('One Hundred Years of Solitude');
    expect(res.body.released).toEqual(1967);
  });

  afterAll(() => {
    pool.end();
  });
});
