const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    // Check if a user with the given username already exists
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
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

    // Authenticate the user
    if (authenticatedUser(username, password)) {
        // Create a JWT token
        const accessToken = jwt.sign({ data: password }, 'access', {
            expiresIn: 60 * 60,
        });
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send('User successfully logged in');
    } else {
        return res
            .status(208)
            .json({ message: 'Invalid Login. Check username and password' });
    }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    //Write your code here

    // Get the ISBN from the request
    const isbn = req.params.isbn;
    // Get the review from the request
    const review = req.body.review;
    const username = req.session.authorization.username;

    // Check if the ISBN exists in the books database
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the review is provided
    if (!review) {
        return res.status(400).json({ message: 'Review is required' });
    }

    // Add the review to the book
    books[isbn].reviews[username] = review;
    let response = {
        message: 'Review added successfully',
        book: {
            isbn: isbn,
            author: books[isbn].author,
            title: books[isbn].title,
            reviews: books[isbn].reviews
        }
    };
    return res
        .status(200)
        .json(response);
});


// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    // Write your code here
    // Get the ISBN from the request
    const isbn = req.params.isbn;

    // Get the username from the session
    const username = req.session.authorization.username;

    // Check if the ISBN exists in the books database
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the review exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' , book: books[isbn]});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
