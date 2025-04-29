const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  
    },
    email: {
        type: String,
        required: true, 
        unique: true,   
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    },
    balance: {
        type: mongoose.Decimal128,  
        default: 100,  
    },
}, {
    timestamps: true,  
});


module.exports = mongoose.model('User', UserSchema);
