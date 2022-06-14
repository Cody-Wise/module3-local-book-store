const pool = require('../utils/pool');

module.exports = class Author {
  id;
  dob;
  pob;
  name;
  constructor(row) {
    this.id = row.id;
    this.dob = row.dob;
    this.pob = row.pob;
    this.name = row.name;
  }

  static async insert({ dob, pob, name }) {
    const { rows } = await pool.query(
      'INSERT INTO authors (dob, pob, name) Values ($1, $2, $3) RETURNING *',
      [dob, pob, name]
    );
    return new Author(rows[0]);
  }
  static async getAll() {
    const { rows } = await pool.query('SELECT * from authors');
    return rows.map((row) => new Author(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `select a.*,
COALESCE (
  json_agg(to_jsonb(b)) FILTER (WHERE b.id is not null),
  '[]') as books
 from books b
 join authors_to_books ab on ab.book_id = b.id
 join authors a on ab.author_id = a.id
 WHERE a.id = 1
 group by a.id`,
      [id]
    );
    return new Author(rows[0]);
  }
};
