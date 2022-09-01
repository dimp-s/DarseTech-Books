const express = require('express');
const router = express.Router();

//Book schema in swagger documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - isbn
 *         - name
 *       properties:
 *         isbn:
 *           type: string
 *           description: The auto generated isbn number for a book
 *         name:
 *           type: string
 *           description: The book title
 *       example:
 *         isbn: d5fEasz098712
 *         name: Normal People
 */

//swagger definition for API documentaion
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', (req, res) => {
  const books = req.app.db.get('books');
  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a specific book by isbn id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by isbn id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

router.get('/:id', (req, res) => {
  const book = req.app.db.get('books').find({ isbn: req.params.id }).value();
  if (!book) {
    res.sendStatus(404);
  }
  res.send(books);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Creates a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: server error
 */
router.post('/', (req, res) => {
  try {
    const book = {
      isbn: req.body.isbn,
      name: req.body.name,
    };
    req.app.db.get('books').push(book).write();
    res.send(book);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book isbn id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
router.put('/:id', (req, res) => {
  try {
    req.app.db
      .get('books')
      .find({ isbn: req.params.id })
      .assign(req.body)
      .write();
    res.send(req.app.db.get('books').find({ isbn: req.params.id }));
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */
router.delete('/:id', (req, res) => {
  req.app.db.get('books').remove({ isbn: req.params.id }).write();
  res.sendStatus(200);
});

module.exports = router;
