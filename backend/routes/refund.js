import express from 'express';
import { authorize, protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import { generalLimiter, refundLimiter } from '../middlewares/rateLimiter.js';
import { 
  createRefund, 
  getAllRefunds, 
  getRefundById, 
  updateRefund, 
  deleteRefund, 
  updateRefundStatus,
  verifyOrderForRefund,
  getAllUserRefunds,
  getRefundsForDownload,
  getRefundByOrder,
  getRefundsForMediatorDownload,
  bulkUpdateRefundStatus, 
} from '../controllers/refundController.js';
import { parseData } from '../middlewares/parseData.js';
import { Roles } from '../utils/constants.js';

const router = express.Router();

// @desc    Create new refund
// @route   POST /api/refund
router.post('/create-refund', 
  upload.none(),
  parseData,
  refundLimiter,
  createRefund
);

// @desc    Get all refunds
// @route   GET /api/all-refunds
router.get('/all-refunds', 
  protect, 
  authorize(Roles.ADMIN, Roles.MEDIATOR), 
  getAllRefunds
);

// @desc    Get all refunds
// @route   GET /api/refund/user/all-refunds
router.get('/user/all-refunds', 
  protect, 
  authorize('user' , 'mediator' , 'admin' , 'seller'), 
  getAllUserRefunds
);

// @desc    Get all refund forms with filters and search
// @route   GET /api/refund/download
// @access  Private/Admin/Mediator

router.get('/download', 
  protect, 
  authorize('admin','seller'), 
  getRefundsForDownload
);

router.get('/mediator/download', 
  protect, 
  authorize('mediator'), 
  getRefundsForMediatorDownload
);

// @desc    Get single refund by ID
// @route   GET /api/refunds/:id
router.get('/:id', 
  protect, 
  authorize('admin', 'mediator', 'user' , 'seller'), 
  getRefundById
);


// @desc    Get single refund by ID
// @route   GET /api/refunds/:id
router.get('/order/:order', 
  protect, 
  authorize('admin', 'mediator', 'user' , 'seller'), 
  getRefundByOrder
);

// @desc    Update refund
// @route   PUT /api/refunds/:id
router.put('/:id', 
  protect, 
  authorize('admin', 'mediator', 'user' , 'seller'),
  upload.fields([
    { name: 'deliveredSS', maxCount: 1 },
    { name: 'reviewSS', maxCount: 1 },
    { name: 'sellerFeedbackSS', maxCount: 1 }
  ]),
  updateRefund
);

// @desc    Bulk Update order status
// @route   PATCH /api/order/bulk/update-status
router.patch('/bulk/update-status', 
  protect, 
  authorize('admin', 'mediator'),
  bulkUpdateRefundStatus
);

// @desc    Update refund status
// @route   put /api/refund/update-status/:id
router.put('/update-status/:id', 
  protect, 
  authorize('admin', 'mediator'),
  updateRefundStatus
);

// @desc    Delete refund
// @route   DELETE /api/refund/delete/:id
router.delete('/:id', 
  protect, 
  authorize('admin'), 
  deleteRefund
);



// @desc    Update refund (legacy route - kept for backward compatibility)
// @route   PUT /api/refunds/update-refund
router.post('/update-refund/:id', 
  protect, 

  authorize('admin', 'mediator', 'user' , 'seller'),
  upload.fields([
    { name: 'deliveredSS', maxCount: 1 },
    { name: 'reviewSS', maxCount: 1 },
    { name: 'sellerFeedbackSS', maxCount: 1 },
    { name: 'returnWindowSS', maxCount: 1 }
  ]),
  parseData,
  updateRefund
);


router.post('/verify', generalLimiter,   verifyOrderForRefund);

export default router;