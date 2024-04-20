const mongoose = require("mongoose")
const BookSchema = mongoose.Schema ({
    bookid: {
        type:String,
        unique:true,
        require:true
    },

    bookname: {
        type:String,
        unique:true,
        require:true,
    },

    authorname: {
        type:String,
        require:true,
    },

    available: {
        type:Number,
        default:0,
    },

    total: {
        type:Number,
        default:0
    },

    bookimage:{
        type:String,
        
    },

    description:{
        type:String
    }







})

module.exports = mongoose.model('book',BookSchema)