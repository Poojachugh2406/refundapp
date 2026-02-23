import express from 'express';
import { orderLimiter } from '../middlewares/rateLimiter.js';
import { validateOrder } from '../middlewares/validation.js';
import { 
  createOrder, 
  updateOrder, 
  getAllOrders, 
  getOrderById, 
  deleteOrder, 
  updateOrderStatus,
  sendReminderEmail,
  bulkUpdateOrderStatus, 
  getOrdersByMediator, 
  getOrdersByProduct, 
  getUserOrders,
  getOrdersforDownload,
  getSellerOrders,
  getOrdersforMediatorDownload
} from '../controllers/orderController.js';
import { authorize, protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import { parseData } from '../middlewares/parseData.js';
import { Roles } from '../utils/constants.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/order/create-order
router.post('/create-order', 
  upload.none(),
  orderLimiter,
  parseData,
  validateOrder,
  createOrder
);

// @desc    Get all orders with filtering and pagination
// @route   GET /api/order/all-orders
router.get('/all-orders', 
  protect, 
  authorize(Roles.ADMIN, Roles.MEDIATOR),
  getAllOrders
);

router.get('/seller/all-orders',
  protect,
  authorize('seller'),
  getSellerOrders
)
router.get('/user/all-orders',
  protect,
  authorize('user' , 'mediator' , 'admin' , 'seller'),
  getUserOrders
)


// @desc    Get orders by product
// @route   GET /api/order/download
router.get('/download',
  protect, 
  authorize('admin', 'seller'), 
  getOrdersforDownload
);
// @desc    Get orders by product
// @route   GET /api/order/download
router.get('/mediator/download',
  protect, 
  authorize( 'mediator' ), 
  getOrdersforMediatorDownload
);


// @desc    Get single order by ID
// @route   GET /api/order/:id
router.get('/:id', 
  protect, 
  authorize('admin', 'mediator', 'user' , 'seller'), 
  getOrderById
);

// @desc    Update order status
// @route   PATCH /api/order/update-status/:id
router.patch('/update-status/:id', 
  protect, 
  authorize('admin', 'mediator'),
  updateOrderStatus
);

// @desc    Bulk Update order status
// @route   PATCH /api/order/bulk/update-status
router.patch('/bulk/update-status', 
  protect, 
  authorize(Roles.ADMIN),
  bulkUpdateOrderStatus
);

// @desc    Send reminder email for pending orders
// @route   POST /api/order/remind
router.post('/remind', 
  protect, 
  authorize(Roles.ADMIN, Roles.MEDIATOR),
  sendReminderEmail
);

// @desc    Delete order
// @route   DELETE /api/order/:id
router.delete('/:id', 
  protect, 
  authorize(Roles.ADMIN), 
  deleteOrder
);

// @desc    Get orders by mediator
// @route   GET /api/orders/mediator/:mediatorId
router.get('/mediator/:mediatorId', 
  protect, 
  authorize('admin', 'mediator'), 
  getOrdersByMediator
);

// @desc    Get orders by product
// @route   GET /api/orders/product/:productId
router.get('/product/:productId', 
  protect, 
  authorize('admin', 'mediator'), 
  getOrdersByProduct
);






// @desc    Update order (legacy route - kept for backward compatibility)
// @route   PUT /api/orders/update-order
router.post('/update-order/:id', 
  protect, 
  authorize('admin', 'mediator','user' , 'seller'),
  upload.fields([
    { name: 'orderSS', maxCount: 1 },
    { name: 'priceBreakupSS', maxCount: 1 }
  ]),
  parseData,
  updateOrder
);

export default router;