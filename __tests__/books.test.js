const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');

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

  it('should return a single books details with a nested author', async () => {
    const res = await request(app).get('/books/2');
    expect(res.status).toBe(200);
    expect(res.body.title).toEqual('One Hundred Years of Solitude');
    expect(res.body.released).toEqual(1967);
    expect(res.body.authors[0].name).toEqual('Gabriel García Márquez');
  });

  it('should add a book', async () => {
    const book = await new Book({
      title: 'Codys Magical Book',
      released: 1999,
    });
    const res = await request(app).post('/books').send(book);
    expect(res.body.title).toEqual(book.title);
    expect(res.body.released).toEqual(book.released);
  });

  afterAll(() => {
    pool.end();
  });
});
