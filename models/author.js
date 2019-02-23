const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    description:{
        type: String,
    },
    photo:{ 
        type: String,
        data: Buffer
    },
    birth_date:{ 
        type: Date,  
    }
});

const Author = mongoose.model('Author', authorSchema);    //////creating model
module.exports = Author; 