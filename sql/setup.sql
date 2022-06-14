-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS authors_to_books;

CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR NOT NULL,
  released INT NOT NULL
)

CREATE TABLE authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dob VARCHAR,
  pob VARCHAR,
  name VARCHAR NOT NULL
)

CREATE TABLE authors_to_books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id BIGINT,
  author_id BIGINT,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (author_id) REFERENCES authors(id)
)

INSERT INTO books (title, released)
VALUES
  ('The Great Gatsby', 1925), 
  ('One Hundred Years of Solitude', 1967);

INSERT INTO authors (dob, pob, name)
VALUES
  ('09/24/1896', 'St Paul, MN', 'F. Scott Fitzgerald'), 
  ('03/06/1927', 'Aracataca, Colombia', 'Gabriel García Márquez');

INSERT INTO books (book_id, author_id)
VALUES
  (1, 1), 
  (2, 2);
