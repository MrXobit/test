const { getOrders } = require('../controller/taskController');
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

describe('TaskController.getOrders', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                userId: 'userId123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    it('should return an error if no orders are found for the user', async () => {
        Order.find.mockResolvedValue([]); 

        await getOrders(req, res, next);

   
        expect(next).toHaveBeenCalledWith(ApiError.notFound('Замовлення не знайдено'));
    });

    it('should return orders for the user', async () => {
        const ordersMock = [{ orderId: 'order123', userId: req.params.userId }];
        Order.find.mockResolvedValue(ordersMock);

        await getOrders(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(ordersMock);
        expect(Order.find).toHaveBeenCalledWith({ userId: req.params.userId });
    });

    it('should return an internal server error if there is an exception', async () => {
        const error = new Error('Database error');
        Order.find.mockRejectedValue(error);

        await getOrders(req, res, next);

        expect(next).toHaveBeenCalledWith(ApiError.internal('Щось пішло не так'));
    });
});
