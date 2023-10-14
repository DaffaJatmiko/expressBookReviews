const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      res.status(200).json({ message: 'Successfully registered' });
    } else {
      res.status(404).json({ message: 'Account already exists!' });
    }
  } else {
    res.status(400).json({
      message: 'Invalid request. Username and password are required.',
    });
  }
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   //Write your code here
//   let bookId = Object.keys(books);
//   let mapBooks = bookId.map((id) => books[id]);
//   let availableBooks = JSON.stringify(mapBooks, null, 2);
//   return res.status(200).send(availableBooks);
// });

public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    try {
      let bookId = Object.keys(books);
      let mapBooks = bookId.map((id) => books[id]);
      let availableBooks = JSON.stringify(mapBooks, null, 2);
      resolve(availableBooks);
    } catch (error) {
      console.error('Error:', error.message);
      reject({ message: 'Internal server error' });
    }
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(500).send(error));
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   let book = books[isbn];

//   if (book) {
//     res.status(200).send(book);
//   } else {
//     res.status(404).send({ message: 'Book not found' });
//   }
// });

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = books[isbn];
    if (book) {
      res.status(200).send(book);
    } else {
      res.status(404).send({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
});
// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   //Write your code here
//   const author = req.params.author.toLowerCase();
//   let bookIds = Object.keys(books);
//   let bookByAuthor = [];

//   bookIds.forEach((id) => {
//     const book = books[id];
//     const bookAuthor = book.author.toLowerCase();
//     if (bookAuthor === author) {
//       bookByAuthor.push(book);
//     }
//   });

//   if (bookByAuthor.length) {
//     res.status(200).send(bookByAuthor);
//   } else {
//     res.status(404).send({ message: 'Books not found' });
//   }
// });

public_users.get('/author/:author', function (req, res) {
  return new Promise((resolve, reject) => {
    const author = req.params.author.toLowerCase();
    let bookIds = Object.keys(books);
    let bookByAuthor = [];

    bookIds.forEach((id) => {
      const book = books[id];
      const bookAuthor = book.author.toLowerCase();
      if (bookAuthor === author) {
        bookByAuthor.push(book);
      }
    });

    if (bookByAuthor.length) {
      resolve(bookByAuthor);
    } else {
      reject({ message: 'Books not found' });
    }
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(404).send(error));
});

// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   //Write your code here
//   const title = req.params.title.toLowerCase();
//   const bookIds = Object.keys(books);
//   let bookByTitle = [];

//   bookIds.forEach((id) => {
//     const book = books[id];
//     const bookTitle = book.title.toLowerCase();
//     if (bookTitle === title) {
//       bookByTitle.push(book);
//     }
//   });

//   if (bookByTitle.length) {
//     res.status(200).send(bookByTitle);
//   } else {
//     res.status(404).send({ message: 'books not found' });
//   }
// });

public_users.get('/title/:title', function (req, res) {
  return new Promise((resolve, reject) => {
    const title = req.params.title.toLowerCase();
    const bookIds = Object.keys(books);
    let bookByTitle = [];

    bookIds.forEach((id) => {
      const book = books[id];
      const bookTitle = book.title.toLowerCase();
      if (bookTitle === title) {
        bookByTitle.push(book);
      }
    });

    if (bookByTitle.length) {
      resolve(bookByTitle);
    } else {
      reject({ message: 'Books not found' });
    }
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(404).send(error));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;

    if (Object.keys(reviews).length) {
      res.status(200).send(reviews);
    } else {
      res.status(404).send({ message: 'Review not found' });
    }
  } else {
    res.status(404).send({ message: 'book not found' });
  }
});

module.exports.general = public_users;
