const  mongoose  = require("mongoose");
const  UserSchema = mongoose.Schema({
    userid: {
        type:String,
        require:true,
        unique:true
    },
    
    
    username: {
        type:String,
        require:true,
        min:3,
        max:30,
    },

    mobilenumber: {
        type:Number,
        require:true,
        unique:true,
    },

    lastbook: {
        bookname: {
            type: String,
            default: null
        },
        duedate: {
            type: Date,
            default: null
        },
        isoverdue: {
            type: Boolean,
            default: false
        },
        startingdate: {
            type:Date,
            default: null
        },
        bookid: {
            type: String,
            default:null
        }
        
    },



})

module.exports = mongoose.model('user',UserSchema)