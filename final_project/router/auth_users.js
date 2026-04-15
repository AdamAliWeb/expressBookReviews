const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validatedUsers = users.filter(user => user.username === username && user.password === password)

    return validatedUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let review = req.body.review
  let currentUser = req.session.authorization.username

  if (books[isbn]) {
    books[isbn].reviews[currentUser] = review
    return res.status(200).json({message: `Review from ${currentUser} updated. Review: ${review}`})
  }
});

regd_users.delete('/auth/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let currentUser = req.session.authorization.username
    
    if (books[isbn]) {
        let findUserReview = Object.keys(books[isbn].reviews).filter(user => user === currentUser)

        if (findUserReview.length > 0) {
            delete books[isbn].reviews[currentUser]
            return res.status(200).send(`Review from ${currentUser} has been deleted.`)
        } else {
            return res.status(404).json({message: `Review not found from ${currentUser}`})
        }
    } else {
        return res.status(404).json({message: "Book not found by the ISBN"})
    }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
