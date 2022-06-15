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

  it('should return a single book details with a nested author', async () => {
    const res = await request(app).get('/books/2');
    expect(res.status).toBe(200);
    expect(res.body.title).toEqual('One Hundred Years of Solitude');
    expect(res.body.released).toEqual(1967);
    expect(res.body.authors[0].name).toEqual('Gabriel García Márquez');
  });

  it('POST /book should create a new book with an associated author', async () => {
    const resp = await request(app)
      .post('/books')
      .send({
        title: 'Codys Magical Cookbook',
        released: 1990,
        authorIds: [1, 2],
      });
    expect(resp.status).toBe(200);
    expect(resp.body.title).toEqual('Codys Magical Cookbook');
    expect(resp.body.released).toEqual(1990);

    const newBook = await request(app).get(`/books/${resp.body.id}`);
    expect(newBook.body.authors.length).toBe(2);
  });

  afterAll(() => {
    pool.end();
  });
});
