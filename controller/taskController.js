const ApiError = require('../error/ApiError');
const Order = require('../models/Orders');
const User = require('../models/Users');  
const Product = require('../models/Products');  
const { default: mongoose } = require('mongoose');

class TaskController {
    async createOrder(req, res, next) {
        try {
            const { userId, productId, quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return next(ApiError.badRequest('Некоректна кількість товару'));
            }

            const user = await User.findById(userId);
            const product = await Product.findById(productId);
            
            if (!user || !product) {
                return next(ApiError.badRequest('Користувача або товар не знайдено'));
            }

            const totalPrice = parseFloat(product.price.toString()) * quantity;

            if (user.balance < totalPrice) {
                return next(ApiError.forbidden('Недостатньо коштів на рахунку'));
            }

            if (product.stock < quantity) {
                return next(ApiError.badRequest('Недостатньо товару на складі'));
            }

            user.balance -= totalPrice;
            product.stock -= quantity;

            await user.save();
            await product.save();

            const order = await Order.create({
                userId,
                productId,
                quantity,
            });

            return res.status(201).json(order);

        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Щось пішло не так'));
        }
    }



    async getOrders (req, res, next) {
        try {
            const { userId } = req.params; 
            const orders = await Order.find({ userId });  
        
            if (!orders || orders.length === 0) {
                return next(ApiError.notFound('Замовлення не знайдено'));
            }
    
            return res.status(200).json(orders);
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Щось пішло не так'));
        }
    }


    async createUsers(req, res, next) {
        try {
            const users = [];
            for (let i = 0; i < 10; i++) {
                const user = new User({
                    name: `User ${i + 1}`,  
                    email: `user${i + 1}@example.com`,
                    balance: mongoose.Types.Decimal128.fromString((Math.floor(Math.random() * 1000) + 100).toString()), 
                });
        
                await user.save();
                users.push(user);
            }
        
            return res.status(201).json(users); 
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Щось пішло не так'));
        }
    }
    

    async createProducts(req, res, next) {
        try {
            const products = [];
            for (let i = 0; i < 10; i++) {
                const product = new Product({
                    name: `Product${i + 1}`,
                    price: mongoose.Types.Decimal128.fromString((Math.floor(Math.random() * 100) + 10).toString()), 
                    stock: Math.floor(Math.random() * 50) + 10,  
                });
        
                await product.save();
                products.push(product);
            }
        
            return res.status(201).json(products); 
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Щось пішло не так'));
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await User.find()
            return res.status(200).json(users)
        } catch (e) {
            console.error(e)
            return next(ApiError.internal('Щось пішло не так'))
        }
    }

    async getProducts(req, res, next) {
        try {
            const products = await Product.find()
            return res.status(200).json(products)
        } catch (e) {
            console.error(e)
            return next(ApiError.internal('Щось пішло не так'))
        }
    }
    
}

module.exports = new TaskController();



