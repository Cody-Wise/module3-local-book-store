const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const newAuthor = await Author.insert(req.body);
      if (req.body.bookIds) {
        await Promise.all(
          req.body.bookIds.map((id) => newAuthor.addBookForAuthor(id))
        );
      }
      res.json(newAuthor);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', async (req, res) => {
    const id = req.params.id;
    const matchingAuthor = await Author.getById(id);
    res.json(matchingAuthor);
  })

  .get('/', async (req, res) => {
    const dataAuthors = await Author.getAll();
    res.json(dataAuthors);
  });
