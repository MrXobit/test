
const Router = require('express');
const taskController = require('../controller/taskController');
const router = new Router();
const rateLimit = require('express-rate-limit')


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10,
  message: 'Перевищено ліміт запитів, спробуйте пізніше.',
  keyGenerator: (req) => {
    return req.body?.userId || req.params?.userId || req.query?.userId || req.ip;
  }  
})

router.post('/orders', limiter, taskController.createOrder)
router.get('/orders/:userId', limiter, taskController.getOrders)
router.post('/orders/createUsers', taskController.createUsers);
router.post('/orders/createProducts', taskController.createProducts);

router.get('/users', taskController.getUsers);
router.get('/products', taskController.getProducts);


module.exports = router;

