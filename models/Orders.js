const mongoose = require('mongoose');

// Створення схеми для Orders
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Product', 
        required: true, 
    },
    quantity: {
        type: Number,
        required: true,  
        min: 1,
    },
    totalPrice: {
        type: mongoose.Decimal128, 
        required: true,  
        default: 0,  
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
}, {
    timestamps: true,
});


OrderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const product = await mongoose.model('Product').findById(this.productId);  
        if (product) {
            this.totalPrice = product.price * this.quantity;
        } else {
            return next(new Error('Product not found'));
        }
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
