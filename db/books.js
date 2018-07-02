var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
   title:{
    type:String,
    required:true
   
   },
  comments:{
    type:Array,
    required:false
  }

})

var Book = module.exports = mongoose.model('Book',bookSchema);

