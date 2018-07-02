/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});


var Book = require('../db/books');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
       var books =[];
      Book.find({},function(err,doc){
       if(err){console.log(err)}
       else{
        for(let i=0;i<doc.length;i++){
          var book={};
           book._id =doc[i]._id;
           book.title=doc[i].title;
           book.commentcount =doc[i].comments.length;
           books.push(book)
        }
         res.json(books)
       
       }
       
      
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var newBook = new Book({
        title:title
      })
      
      newBook.save(newBook,function(err,book){
        
        if(err){
       console.log(err)
        res.json({"msg":"some thing went wrong"})
        }
        else{
         res.json({title:book.title,
                  _id:book._id})
        }
      })
      
                
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful';
     //console.log("hi")
      Book.deleteMany({}, function (err) {
         if (err) console.log(err);
         else{
           console.log("hi")
          res.json({"msg":"successfuly deleted"})
         
         }
  // deleted at most one tank document
   });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
     Book.findById(bookid,function(err,book){
       if(err){
         console.log("can not get")
         res.end("some thing went wrong")
       
       }
       if(!book){
        res.end("can not get the book ")
       }
       else{
      res.json(book)}
     })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
    // { $push: { friends: friend }
      Book.findById(bookid,function(err,book){
       if(err){
        console.log(err);
         res.end("error")
       }
        if(!book){
         res.end("can not update")
        }
        else{
          const books = book;
          books.comments.push(comment);
          Book.findByIdAndUpdate(bookid ,books,{new:true}, function(err,doc1){
          if(err){
          console.log(err)
          res.end("error")
         }
        else{
          console.log(doc1)
          res.json(doc1)
        }
      
      })
          
        }
      
      
      })
      
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful';
     Book.findById(bookid,function(err,doc){
      if(err){
       console.log(err);
        res.send("delete unsuccessful")
      }
       if(!doc){
        res.send("book not found")
       }
       else{
         Book.deleteOne({ _id:bookid}, function (err) {
           if(err){
            console.log(err)
             res.send("delete unsuccessful")
           }
         
         })
       
       }
     
     })
    
    });
  
};
