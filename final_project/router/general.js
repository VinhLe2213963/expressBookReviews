const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
    //Write your code here
    // Get the username and password from the request
    const username = req.body.username;
    const password = req.body.password;

    // Check if the username and password are provided
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: 'Username and password are required' });
    }

    // Check if the username is valid
    if (!isValid(username)) {
        return res.status(400).json({ message: 'Invalid username' });
    }

    users.push({ username, password });
    return res
        .status(200)
        .json({ message: 'User successfully registered. Now you can login' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    // Use promise callback to return the books
    return new Promise((resolve, reject) => {
        resolve(books);
    })
        .then((books) => {
            return res.status(200).json(books);
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    // Use promise callback to return the book details
    return new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: 'Book not found' });
        }
    })
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    // Use promise callback to return the books based on author
    return new Promise((resolve, reject) => {
        const author = req.params.author;
        let booksByAuthor = [];
        for (let book in books) {
            if (books[book].author === author) {
                booksByAuthor.push(books[book]);
            }
        }

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject({ message: 'Author not found' });
        }
    })
        .then((booksByAuthor) => {
            return res.status(200).json(booksByAuthor);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    // Use promise callback to return the books based on title
    return new Promise((resolve, reject) => {
        const title = req.params.title;
        let booksByTitle = [];
        for (let book in books) {
            if (books[book].title === title) {
                booksByTitle.push(books[book]);
            }
        }

        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject({ message: 'Title not found' });
        }
    })
        .then((booksByTitle) => {
            return res.status(200).json(booksByTitle);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    // Get the ISBN from the request
    const isbn = req.params.isbn;

    // Check if the ISBN exists in the books database
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
