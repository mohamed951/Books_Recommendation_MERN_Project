const express = require("express");
const mongoose = require("mongoose");
const bookRouter = express.Router();
const Book = require("../models/book");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const fs = require("fs");
const multer = require("multer");
const validator = require("validator");
bookRouter.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: "./public/uploads/",
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

//retrieving books

bookRouter.get("/", (req, res, next) => {
  Book.find()
    .then(books => {
      res.json([...books]);
    })
    .catch(err => {
      res.json(err);
    });
});

bookRouter.get("/category/:id", (req, res, next) => {
  console.log("HELLO FROM CATEOGRY?ID",req.params.id)
  Book.find({ category_id: req.params.id }).then(books => {
    console.log("HELLO1")
    if(books)
      res.json([...books]);
    else res.json("ERROR")
    console.log("HELLO2")

  })
  .catch(err => {
    // res.json(err);
  });
    
});

bookRouter.get("/:id",verifyToken, (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(books => {
      return res.json(books);
    })
    .catch(err => {
      return  res.json(err);
    });
});

bookRouter.get("/pop/all", (req, res, next) => {
  Book.find({}, "name")
    .limit(3)
    .then(books => {
      res.json(books);
    })
    .catch(err => {
      res.json("error in retrieving books");
    });
});
//adding new book
bookRouter.post("/", upload.single("photo"), (req, res, next) => {
  console.log(req.body);
  const bookData = new Book();
  bookData.name = req.body.name;
  bookData.description = req.body.description;
  bookData.author_id = req.body.author_id;
  bookData.category_id = req.body.category_id;
  bookData.rate = 0;
  bookData.num_of_persons = 0;
  if (req.file.path) {
    bookData.photo.data = fs.readFileSync(req.file.path);
    bookData.photo.type = "image/jpeg"; // or 'image/png'
  } else bookData.photo = {};

  if (
    validator.isByteLength(req.body.name, { min: 1, max: 100 }) &&
    validator.isByteLength(req.body.description, { min: 1, max: 1000 })
  ) {
    bookData.save(err => {
      console.log("SAVED OBJECT");
      // console.log(bookData.populate('author_id').
      // populate('category_id').execPopulate());

      if (!err) {
        bookData
          .populate("author_id")
          .populate("category_id")
          .execPopulate()
          .then(() => {
            console.log(bookData);
            res.json(bookData);
          });
      } else res.json("Error in insertion");
    });
  }
});

// authorRouter.post('/', upload.single('photo'), function(req, res) {
//     console.log(req.body);
//     let bookData = new Author();
//     bookData.first_name = req.body.first_name;
//     bookData.last_name = req.body.last_name;
//     bookData.description = req.body.description;
//     bookData.birth_date = req.body.birth_date;
//     bookData.photo.data = fs.readFileSync(req.file.path);
//     bookData.photo.type = 'image/jpeg';  // or 'image/png'
//     bookData.save((err, data) => {
//         if (!err)
//             res.json(data);
//         else res.json("Error in insertion");
//     })
// })

//editing book
bookRouter.put("/", upload.single("photo"), (req, res, next) => {
  console.log("HELLO HEader");
  console.log(req.body);
  const editedBook = {
    name: req.body.name,
    author_id: req.body.author_id,
    category_id: req.body.category_id,
    description: req.body.description,
  };
  if (req.file) {
    editedBook.photo = {};
    editedBook.photo.data = fs.readFileSync(req.file.path);
    editedBook.photo.type = "image/jpeg";
  }
  Book.updateOne({ _id: req.body._id }, { $set: editedBook }).then(data => {
    Book.find({ _id: req.body._id })
      .then(data => {
        res.json(data[0]);
      })
      .catch(error => {
        res.json(error);
      });
  });
});
//deleting book
bookRouter.delete("/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id }, err => {
    if (!err) res.json("book deleted successfully");
    else res.json("error in deleting book");
  });
});

function verifyToken(req , res , next){
  //get auth header value 
  // const bearerHeader = req.headers['authorization'];
  const bearerToken = req.headers['authorization'];

  // if(typeof bearerHeader !== 'undefined'){
  //     const bearer = bearerHeader.split(' ');
  //     // get token from array
  //     const bearerToken = bearer[1];
  //     //set the token
      jwt.verify(bearerToken,'secret_key', (err, decoded) =>{      
        if (err) {
          return res.json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
      // req.token = bearerToken;
  // }else{
  //   return res.json();
  //     // return res.json(403);
  // }
  // next();
}

module.exports = bookRouter;
