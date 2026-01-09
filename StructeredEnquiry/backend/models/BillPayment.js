const mongoose = require('mongoose');

/**
 * MongoDB Schema for Electricity Bill Payments
 * Collection: prajwal_structure_billpayments
 */
const billPaymentSchema = new mongoose.Schema({
  // Reference to user who made the payment
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for backward compatibility
  },

  // Consumer's ID who is paying the bill
  consumerId: {
    type: String,
    required: [true, 'Consumer ID is required'],
    trim: true
  },

  // Name of the selected electricity plan
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },

  // Number of electricity units consumed
  unitsUsed: {
    type: Number,
    required: [true, 'Units used is required'],
    min: [0, 'Units cannot be negative']
  },

  // Total amount paid for the bill
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
    min: [0, 'Amount cannot be negative']
  },

  // Remaining units after consumption (from prepaid plan)
  remainingUnits: {
    type: Number,
    required: [true, 'Remaining units is required']
  },

  // Status of the payment transaction
  paymentStatus: {
    type: String,
    enum: ['success', 'failure'],
    required: [true, 'Payment status is required']
  },

  // Admin approval status
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Timestamp of when the transaction occurred
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  // Add timestamps (createdAt, updatedAt) automatically
  timestamps: true,
  collection: 'prajwal_structure_billpayments' // Custom collection name
});

// Create index on transactionDate for faster queries
billPaymentSchema.index({ transactionDate: -1 });

// Create index on consumerId for searching by consumer
billPaymentSchema.index({ consumerId: 1 });

/**
 * Export the model
 * Collection name will be "billpayments" (lowercase, pluralized)
 * This will appear as a separate collection in MongoDB Compass
 */
module.exports = mongoose.model('BillPayment', billPaymentSchema);
