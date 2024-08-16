const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//DB connect
const uri = "mongodb+srv://3380:3380@tm-1.3rfpsev.mongodb.net/BookDB";
mongoose.connect(uri);


const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection Connected");
});




const bookSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  bookAuthor: { type: String, required: true },
  description: { type: String },
});


const BookRecord = mongoose.model("300379455-TazMa", bookSchema);

const router = require('express').Router();

app.use('/', router)


//get all
router.route('/api/v1/book').get((req, res) => {
    
    BookRecord.find()
        .then((books)=>{res.json(books)})
        .catch((err)=>{
            res.status(400).json('Error'+err)
        })

  });

  //Add
  router.route('/api/v1/book/add').post((req, res) => {
    
   const bookTitle = req.body.bookTitle
   const bookAuthor = req.body.bookAuthor
   const description = req.body.description

   const newBookrecord = new BookRecord({
    bookTitle,bookAuthor,description});
  
  newBookrecord
      .save()
      .then(() => res.json('Book added!'))
      .catch((err) => res.status(400).json('Error: ' + err));
  });

// get by ID
  router.route('/api/v1/book/:id').get((req, res) => {
    
    BookRecord.findById(req.params.id)
        .then((books)=>{res.json(books)})
        .catch((err)=>{
            res.status(400).json('Error'+err)
        })

  });

// update
router.route('/api/v1/book/update/:id').put((req, res) => {

    BookRecord.findById(req.params.id)
    .then((books)=>{
        
        books.bookTitle = req.body.bookTitle
        books.bookAuthor = req.body.bookAuthor
        books.description = req.body.description
        
       books
           .save()
           .then(() => res.json('Updated!'))
           .catch((err) => res.status(400).json('Error: ' + err));

    })

    .catch((err)=>{
        res.status(400).json('Error'+err)
    })
   });
 
//Delete

router.route('/api/v1/book/delete/:id').delete((req, res) => {

    BookRecord.findByIdAndDelete(req.params.id)

    .then(()=>{ res.json('Deleted')})

    .catch((err)=>{
        res.status(400).json('Error'+err)
    })
   });







app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });