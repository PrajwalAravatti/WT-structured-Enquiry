const express = require('express');
const router = express.Router();
const BillPayment = require('../models/BillPayment');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Predefined Electricity Plans
 * These are the available prepaid electricity plans
 */
const ELECTRICITY_PLANS = [
    {
        planName: 'Basic Plan',
        pricePerUnit: 5,
        unitsIncluded: 100,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Standard Plan',
        pricePerUnit: 4.5,
        unitsIncluded: 250,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Premium Plan',
        pricePerUnit: 4,
        unitsIncluded: 500,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Ultra Plan',
        pricePerUnit: 3.5,
        unitsIncluded: 1000,
        validity: 60,
        status: 'Active'
    }
];

/**
 * GET /payments
 * Get user's own payment history
 */
router.get('/payments', protect, async (req, res) => {
    try {
        const payments = await BillPayment.find({ userId: req.user._id })
            .sort({ transactionDate: -1 })
            .limit(50);

        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
});

/**
 * GET /payments/all
 * Get all payments (Admin only)
 */
router.get('/payments/all', protect, authorize('admin'), async (req, res) => {
    try {
        const payments = await BillPayment.find()
            .sort({ transactionDate: -1 })
            .limit(100);

        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
});

/**
 * GET /payments/pending
 * Get all pending payments (Admin only)
 */
router.get('/payments/pending', protect, authorize('admin'), async (req, res) => {
    try {
        const payments = await BillPayment.find({ approvalStatus: 'pending' })
            .sort({ transactionDate: -1 })
            .limit(100);

        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Error fetching pending payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending payments'
        });
    }
});

/**
 * PUT /payments/:id/approve
 * Approve a payment (Admin only)
 */
router.put('/payments/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const payment = await BillPayment.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: 'approved' },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment approved successfully',
            payment
        });
    } catch (error) {
        console.error('Error approving payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve payment'
        });
    }
});

/**
 * PUT /payments/:id/reject
 * Reject a payment (Admin only)
 */
router.put('/payments/:id/reject', protect, authorize('admin'), async (req, res) => {
    try {
        const payment = await BillPayment.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: 'rejected' },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment rejected successfully',
            payment
        });
    } catch (error) {
        console.error('Error rejecting payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject payment'
        });
    }
});


/**
 * POST /paybill
 * Route handler for processing electricity bill payments
 * Authentication is optional for backward compatibility
 * 
 * Input: { consumerId, planName, unitsUsed }
 * Output: { paymentStatus, remainingUnits, totalAmount, message }
 */
router.post('/paybill', async (req, res) => {
    try {
        // Step 1: Extract input data from request body
        const { consumerId, planName, unitsUsed } = req.body;

        // Try to get userId from token if provided
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Token invalid or expired, continue without userId
                console.log('Invalid token, proceeding without userId');
            }
        }

        // Step 2: Input Validation
        // Check if all required fields are provided
        if (!consumerId || !planName || unitsUsed === undefined) {
            return res.status(400).json({
                paymentStatus: 'failure',
                message: 'Missing required fields: consumerId, planName, and unitsUsed are required'
            });
        }

        // Validate consumerId is not empty
        if (consumerId.trim().length === 0) {
            return res.status(400).json({
                paymentStatus: 'failure',
                message: 'Consumer ID cannot be empty'
            });
        }

        // Validate unitsUsed is a positive number
        if (typeof unitsUsed !== 'number' || unitsUsed < 0) {
            return res.status(400).json({
                paymentStatus: 'failure',
                message: 'Units used must be a positive number'
            });
        }

        // Step 3: Find the selected plan from predefined plans
        const selectedPlan = ELECTRICITY_PLANS.find(
            plan => plan.planName.toLowerCase() === planName.toLowerCase()
        );

        // Check if plan exists
        if (!selectedPlan) {
            return res.status(404).json({
                paymentStatus: 'failure',
                message: `Plan "${planName}" not found`
            });
        }

        // Check if plan is active
        if (selectedPlan.status !== 'Active') {
            return res.status(400).json({
                paymentStatus: 'failure',
                message: `Plan "${planName}" is not active`
            });
        }

        // Step 4: Calculate bill details

        // Calculate total amount based on units used and price per unit
        const totalAmount = unitsUsed * selectedPlan.pricePerUnit;

        // Calculate remaining units (total included units - units used)
        const remainingUnits = selectedPlan.unitsIncluded - unitsUsed;

        // Step 5: Determine payment status
        // Payment is successful if units used are within the plan's included units
        let paymentStatus;
        let message;

        if (unitsUsed <= selectedPlan.unitsIncluded) {
            paymentStatus = 'success';
            message = 'Payment processed successfully';
        } else {
            paymentStatus = 'failure';
            message = `Insufficient units. Plan includes ${selectedPlan.unitsIncluded} units, but ${unitsUsed} units were used.`;
        }

        // Step 6: Save bill payment to database
        const billPayment = new BillPayment({
            userId: userId, // Save userId if user is logged in
            consumerId: consumerId.trim(),
            planName: selectedPlan.planName,
            unitsUsed: unitsUsed,
            amountPaid: totalAmount,
            remainingUnits: remainingUnits,
            paymentStatus: paymentStatus
        });

        // Save to MongoDB
        await billPayment.save();

        // Step 7: Return response
        return res.status(200).json({
            paymentStatus: paymentStatus,
            remainingUnits: remainingUnits,
            totalAmount: totalAmount,
            message: message,
            transactionId: billPayment._id,
            transactionDate: billPayment.transactionDate
        });

    } catch (error) {
        // Handle any server errors
        console.error('Error processing bill payment:', error);
        return res.status(500).json({
            paymentStatus: 'failure',
            message: 'Server error occurred while processing payment',
            error: error.message
        });
    }
});

module.exports = router;


