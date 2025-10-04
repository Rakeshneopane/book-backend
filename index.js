const express = require("express");
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

const { initialiseDatabase } = require("./db/dbConnect.js");

const Books = require("./models/books.models.js");

initialiseDatabase();

app.get("/",(req,res)=>{
    res.send("Book API is working.");
});

app.listen(PORT,()=>{
    console.log("Server running on port: ", PORT); 
});

const createBook = async(bookObject)=>{
    try {
        const newBook = new Books(bookObject);
        const saveBook = await newBook.save();
        return saveBook;
    } catch (error) {
        console.log("Failed to create book", error);
    }
}

app.post("/books",async (req,res)=>{
    try {
        if(!req.body.title || !req.body.author || !req.body.publishedYear )
        {
            res.status(400).json({error : "Title, author and published year are required"});
        }
        else{
            const savedBook = await createBook(req.body);
            res.status(201).json({message : "Book created successfully", book: savedBook});
        }
    } catch (error) {
        res.status(500).json({error: "Book creation has failed"})
    }
});


const readAllBooks = async ()=>{
    try {
        const allBooks = await Books.find();
            return allBooks;
    } catch (error) {
        console.log("Error in finding the books.", error);
    }
}
app.get("/books",async (req,res)=>{
    try {
        const books = await readAllBooks();
        if(books.length != 0){
            res.json(books);
        }
        else{
            res.status(404).json({error: "Books not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fetching books."})
    }
});

const readBooksByTitle = async(name)=>{
    try {
        const books = await Books.findOne({title: name});
        return books;
    } catch (error) {
        throw error;
    }
};

app.get("/books/:title",async (req,res)=>{
    try {
        const books = await readBooksByTitle(req.params.title);
        if(books){
            res.json(books);
        }
        else{
            res.status(400).json({error: "No books found"});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fetching."})
    }
});

const readBooksByAuthor = async(author)=>{
    try {
        const books = await Books.find({author});
        return books;
    } catch (error) {
        throw error;
    }
};

app.get("/author/:author", async(req,res)=>{
    try {
        const books = await readBooksByAuthor(req.params.author);
        if(books.length !=0 ){
            res.status(200).json(books);
        }
        else{
            res.status(400).json({error: "No books by author."})
        }
    } catch (error) {
        res.status(500).json({error: "Erron while fetching."})
    }
});

const readBooksByGenre = async(genre)=>{
    try {
        const books = await Books.find({genre});
        return books;
    } catch (error) {
        throw error;
    }
};

app.get("/genre/:genre", async(req,res)=>{
    try {
        const books = await readBooksByGenre(req.params.genre);
       
        if(books.length != 0){
             res.status(200).json(books);
        }
        else{
             res.status(400).json({error: "Book not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fethcing."});
    }
});

const readBooksByYear = async(publishedYear)=>{
    try {
        const books = await Books.find({publishedYear});
        return books;
    } catch (error) {
        throw error;
    }
};

app.get("/year/:publishedYear", async(req,res)=>{
    try {
        const books = await readBooksByYear(req.params.publishedYear);
       
        if(books.length != 0){
             res.status(200).json(books);
        }
        else{
             res.status(400).json({error: "Book not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fethcing."});
    }
});

const updateBookRating = async(bookId,rating)=>{
    try {
        const book = await Books.findByIdAndUpdate(bookId,{rating},{new: true});
        return book;
    } catch (error) {
        throw error;
    }
};

app.post("/updateBook/:id", async(req,res)=>{
    try {
        const book = await updateBookRating(req.params.id, req.body.rating);
       
        if(book){
             res.status(200).json({message: "Book rating updated successfully", book: book});
        }
        else{
             res.status(400).json({error: "Book not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fethcing."});
    }
});

const updateBookRatingByTitle = async(bookTitle,body)=>{
    try {
        const updateBook = await Books.findOneAndUpdate({title: bookTitle},{publishedYear: body.publishedYear,rating: body.rating
        },{new: true});
        return updateBook;
    } catch (error) {
        throw error;
    }
};

app.post("/updateBookByTitle/:title", async(req,res)=>{
    try {
        const updatedbook = await updateBookRatingByTitle(req.params.title, req.body);
       
        if(updatedbook){
             res.status(200).json({message: "Book rating updated successfully", updatedbook: updatedbook});
        }
        else{
             res.status(400).json({error: "Book not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fethcing."});
    }
});

const deleteBookById = async(bookId)=>{
    try {
        const deleteBook = await Books.findByIdAndDelete(bookId);
        return deleteBook;
    } catch (error) {
        throw error;
    }
};

app.delete("/deleteBook/:id", async(req,res)=>{
    try {
        const deletedBook = await deleteBookById(req.params.id);
       
        if(deletedBook){
             res.status(200).json({message: "Book deleted successfully", deletedBook: deletedBook});
        }
        else{
             res.status(400).json({error: "Book not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Error while fethcing."});
    }
});

