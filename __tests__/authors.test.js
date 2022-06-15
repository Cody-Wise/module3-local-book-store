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
    const authorList = res.body.find(
      (author) => author.name === 'F. Scott Fitzgerald'
    );
    expect(authorList).toHaveProperty('dob', '09/24/1896');
    expect(authorList).toHaveProperty('pob', 'St Paul, MN');
  });

  it('should return single author details with nested book', async () => {
    const res = await request(app).get('/authors/2');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toEqual('Gabriel García Márquez');
    expect(res.body[0].dob).toEqual('03/06/1927');
    expect(res.body[0].books[0].title).toEqual('One Hundred Years of Solitude');
  });

  it('POST /author should create a new author with an associated book', async () => {
    const resp = await request(app)
      .post('/authors')
      .send({
        dob: '11/15/1985',
        pob: 'Heppner, Oregon',
        name: 'Cody Wise',
        bookIds: [1, 2],
      });
    expect(resp.status).toBe(200);
    expect(resp.body.dob).toEqual('11/15/1985');
    expect(resp.body.pob).toEqual('Heppner, Oregon');
    expect(resp.body.name).toEqual('Cody Wise');

    const newAuthor = await request(app).get(`/authors/${resp.body.id}`);
    expect(newAuthor.body[0].books.length).toBe(2);
  });

  afterAll(() => {
    pool.end();
  });
});
