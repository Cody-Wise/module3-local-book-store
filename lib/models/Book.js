const pool = require('../utils/pool');

class Book {
  id;
  title;
  released;

  constructor(book) {
    this.id = book.id;
    this.title = book.title;
    this.released = book.released;
    // this.authors = row.authors.length > 0 ? row.authors.map((author) => new Author(author)) : [];
  }

  static async insert({ title, released }) {
    const { rows } = await pool.query(
      'INSERT INTO books (title, released) Values ($1, $2) RETURNING *',
      [title, released]
    );
    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('select * from books');
    return rows.map((row) => new Book(row));
  }

  static async getBookById(id) {
    const { rows } = await pool.query(
      `select b.*,
    coalesce (
        json_agg(to_jsonb(a)) FILTER (WHERE a.id is not null), 
        '[]') as authors
    from books b
    join authors_to_books ab on ab.book_id = b.id
    join authors a on ab.author_id = a.id
    WHERE b.id = $1 
    group by b.id;`,
      [id]
    );
    return new Book(rows[0]);
  }
}

module.exports = Book;
