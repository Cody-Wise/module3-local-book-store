const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const newBook = await Book.insert(req.body);
      if (req.body.authorIds) {
        await Promise.all(
          req.body.authorIds.map((id) => newBook.addAuthorForBook(id))
        );
      }
      res.json(newBook);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id;
    const singleBook = await Book.getBookById(id);
    res.json(singleBook);
  })

  .get('/', async (req, res) => {
    const bookList = await Book.getAll();
    res.json(bookList);
  });
