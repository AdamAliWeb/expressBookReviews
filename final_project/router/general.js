const express = require('express');
const axios = require("axios").default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
 
const doesExist = (username) => {
    let usersWithSameName = users.filter(user => user.username === username)

    return usersWithSameName.length > 0
}

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!doesExist(username)) {
        users.push({username, password})
        return res.status(200).json({message: "User successfully registered! Now proceed to login"})
    } else {
        return res.status(404).json({message: "User already exists!"})
    }
  }

  return res.status(404).json({message: "Unable to register user"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let methCall = new Promise((resolve, reject) => {
        try {
            let allBooks = books
            resolve(allBooks)
        } catch (err) {
            reject(err)
        }
    })

    methCall.then(resp => {
        return res.status(200).send(JSON.stringify(resp, null, 4));
    }).catch(err => {
        return res.status(400).json({message: `The books couldn't be retrieved. ${err} has occured`});
    }) 
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn

    let methCall = new Promise((resolve, reject) => {
        try {
            let allBooks = books
            resolve(allBooks)
        } catch (err) {
            reject(err)
        }
    })

    methCall.then(resp => {
        return res.status(200).send(resp[isbn])
    }).catch(err => {
        return res.status(400).json({message: `The books couldn't be retrieved. ${err} has occured`});
    }) 
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    let booksByAuthor = {};

    Object.keys(books).forEach(book => {
        if (books[book]) {
            if (books[book].author === author) {
                booksByAuthor[book] = books[book]
            }
        }
    });

    if (Object.keys(booksByAuthor > 0)) {
        return res.send(JSON.stringify(booksByAuthor, null, 4))
    } else {
        return res.status(404).json({message: "Book not found by the Author"});
    }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    let booksByTitle = {};

    Object.keys(books).forEach(book => {
        if (books[book]) {
            if (books[book].title === title) {
                booksByTitle[book] = books[book]
            }
        }
    });

    if (Object.keys(booksByTitle > 0)) {
        return res.send(JSON.stringify(booksByTitle, null, 4))
    } else {
        return res.status(404).json({message: "Book not found by the Title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn

    if (books[isbn]) {
        return res.status(200).send(books[isbn].reviews)
    } else {
        return res.status(400).json({message: "Book not found by the ISBN"})
    }
    
});



module.exports.general = public_users;
