const express = require("express");
const router = express.Router();
const Book = require("../Models/BookModel");
const User = require("../Models/UserModel");

router.post("/createbook", async (req, res) => {
  try {
    const { bookid, bookname, authorname, total, bookimage, description } =
      req.body;

    const existingBook = await Book.findOne({ bookname });
    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const newBook = new Book({
      bookid,
      bookname,
      authorname,
      available: total,
      total,
      bookimage,
      description,
    });

    await newBook.save();
    const updatebooks = await Book.find();

    res.status(201).json(updatebooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// get
router.get("/getbook", async (req, res) => {
  try {
    // Fetch all books from the database
    const books = await Book.find();

    // Send the books as a JSON response
    res.json(books);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get book by name
router.get("/getbook/:bookname", async (req, res) => {
  try {
    const bookname = req.params.bookname;

    // Find the book by name in the database
    const book = await Book.findOne({ bookname });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Send the book as a JSON response
    res.json(book);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//get book by id
router.get("/getbookbyid/:bookid", async (req, res) => {
  try {
    const bookid = req.params.bookid;

    const book = await Book.findOne({ bookid });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//Delete book by id
router.post("/deletebookbyid/:bookid", async (req, res) => {
  try {
    const bookid = req.params.bookid;

    const book = await Book.findOne({ bookid });

    if (!book) {
      return res.status(404).json({ error: "No Book found with this book Id" });
    }

    const data = await Book.deleteOne({ bookid });

    res.json(data);
  } catch (error) {
    // Handle error appropriately, e.g., logging or sending a generic error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update the books
router.put("/updatebook/:bookid", async (req, res) => {
  try {
    const bookid = req.params.bookid;
    const { bookname, authorname, available, total } = req.body;

    // Find the book by its ID
    let book = await Book.findOne({ bookid });

    if (!book) {
      return res.status(404).json({ error: "No Book found with this book Id" });
    }

    // Update the book properties
    book.bookname = bookname || book.bookname;
    book.authorname = authorname || book.authorname;
    book.available = available || book.available;
    book.total = total || book.total;

    // Save the updated book
    await book.save();

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Issue BOOK by bookid and userid
router.put("/issuebook/:bookid/:userid", async (req, res) => {
  try {
    const bookid = req.params.bookid;
    const userid = req.params.userid;
    const {duedate,startingdate} = req.body;
    

    // Check if the user already has a book issued
    const user = await User.findOne({ userid });

    if(!user){
      return res.status(404).json({ error: "User not found" });
    }

     if (user.lastbook.bookname) {
      return res.status(400).json({ error: "User already has a book issued" });
    }

    // Check if the book is available
    const book = await Book.findOne({ bookid });

    if (!book || book.available - 1 <= 0) {
      return res.status(404).json({ error: "Book not available" });
    }

    // Update book availability
    book.available--;

    // Update user's record with the issued book
    user.lastbook.bookname = book.bookname;
    user.lastbook.bookid = bookid;
    user.lastbook.duedate = duedate; // You should set an appropriate due date
    user.lastbook.isoverdue = false;
    user.lastbook.startingdate = startingdate;
    

    // Save the updated book and user records
    await book.save();
    await user.save();

    res.json({ message: "Book issued successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/unissuebook/:userid", async (req, res) => {
  const userid = req.params.userid;

  try {
      // Find the user by userid
      const user = await User.findOne({ userid });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Check if the user has a book issued
      if (!user.lastbook.bookname) {
          return res.status(400).json({ error: "User has no books issued" });
      }

      // Get the book name from the user's last issued book
      const bookid = user.lastbook.bookid;

      // Find the book by its name
      const book = await Book.findOne({ bookid });

      if (!book) {
          return res.status(404).json({ error: "Book not found" });
      }

      // Update book availability and set user's lastbook to null
      book.available += 1; // Increase availability by 1
      user.lastbook.bookname = null; // Set lastbook to null
      user.lastbook.duedate = null;
      user.lastbook.isoverdue = null;
      user.lastbook.startingdate = null;
      user.lastbook.bookid = null;

      // Save changes to both user and book documents
      await user.save();
      await book.save();

      const updatedlist = await User.find()

      res.status(200).json({ updatedlist });
  } catch (error) {
      console.error("Error unissuing book:", error);
      res.status(500).json({ error: "Failed to unissue book" });
  }
});


module.exports = router;
