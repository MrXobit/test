const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    price: {
        type: mongoose.Decimal128,  
        required: true,  
    },
    stock: {
        type: Number,
        required: true,  
        min: 0, 
    },
}, {
    timestamps: true,  
});


module.exports = mongoose.model('Product', ProductSchema);
