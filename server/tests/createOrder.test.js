const { createOrder } = require('../controller/taskController');
const ApiError = require('../error/ApiError');
const User = require('../models/Users');
const Product = require('../models/Products');
const Order = require('../models/Orders');

jest.mock('../models/Users');
jest.mock('../models/Products');
jest.mock('../models/Orders');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
});


describe('TaskController.createOrder', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                userId: 'userId123',
                productId: 'productId123',
                quantity: 2
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    it('should return an error if quantity is invalid', async () => {
        req.body.quantity = -1;

        await createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.badRequest('Некоректна кількість товару'));
    });

    it('should return an error if user or product is not found', async () => {
        User.findById.mockResolvedValue(null);
        Product.findById.mockResolvedValue(null);

        await createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.badRequest('Користувача або товар не знайдено'));
    });

    it('should return an error if user has insufficient balance', async () => {
        const userMock = { balance: 1000, save: jest.fn() };  
        const productMock = { price: 100, stock: 5 };

        User.findById.mockResolvedValue(userMock);
        Product.findById.mockResolvedValue(productMock);

        req.body.quantity = 15;

        await createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.forbidden('Недостатньо коштів на рахунку'));
    });

    it('should return an error if not enough stock', async () => {
        const userMock = { balance: 1000, save: jest.fn() };
        const productMock = { price: 100, stock: 5 };

        User.findById.mockResolvedValue(userMock);
        Product.findById.mockResolvedValue(productMock);

        req.body.quantity = 10;

        await createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.badRequest('Недостатньо товару на складі'));
    });

    it('should create an order successfully', async () => {
        const userMock = { balance: 1000, save: jest.fn() };  
        const productMock = { price: 100, stock: 10, save: jest.fn() }; 
        const orderMock = { userId: req.body.userId, productId: req.body.productId, quantity: req.body.quantity };

        User.findById.mockResolvedValue(userMock);
        Product.findById.mockResolvedValue(productMock);
        Order.create.mockResolvedValue(orderMock);

        await createOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(orderMock);
        expect(User.findById).toHaveBeenCalledWith(req.body.userId);
        expect(Product.findById).toHaveBeenCalledWith(req.body.productId);
        expect(Order.create).toHaveBeenCalledWith({
            userId: req.body.userId,
            productId: req.body.productId,
            quantity: req.body.quantity
        });
    });

    it('should return an internal server error if there is an exception', async () => {
        const error = new Error('Database error');
        User.findById.mockRejectedValue(error);

        await createOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.internal('Щось пішло не так'));
    });
});
