const mongoose = require("mongoose");
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./Route/User')
const bookRouter = require('./Route/Book')
const cors = require('cors')



dotenv.config();

const app = express();
app.use(cors());
const port = 5000;
app.use(express.json())

const MONGO_URI = "mongodb+srv://aklanta:aklanta@cluster0.ebzwfrx.mongodb.net/library?retryWrites=true&w=majority"

app.use('/api/user',userRouter)
app.use('/api/book',bookRouter)

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(port, () => {
    console.log("Server is running on port", port);
});
