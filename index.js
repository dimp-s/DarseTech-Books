const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');

//for swagger api documentation and commenting
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//books router
const booksRouter = require('./routes/books');

//define PORT for server
const PORT = process.env.PORT || 5000;

//for storing our data in "db.json" file (use filesync adapter from lowdb)
const fileSync = require('lowdb/adapters/FileSync');

//iniatialize database using fileSync
const adapter = new fileSync('db.json');
//database instance
const db = low(adapter);
db.defaults({ books: [] }).write();

//swagger documenation options for books route
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Darse Books API',
      version: '1.0.0',
      description: 'Darsetech books system.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specifications = swaggerJsDoc(options);

//api for books
const app = express();

//this API allows to test API using swaggerUI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specifications));
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/books', booksRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
