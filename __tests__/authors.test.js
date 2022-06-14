const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author');

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

  it('should add an author', async () => {
    const author = await new Author({
      dob: '11/15/1985',
      pob: 'Heppner, Oregon',
      name: 'Cody Wise',
    });
    const res = await request(app).post('/authors').send(author);
    expect(res.body.dob).toEqual(author.dob);
    expect(res.body.pob).toEqual(author.pob);
    expect(res.body.name).toEqual(author.name);
  });

  afterAll(() => {
    pool.end();
  });
});
