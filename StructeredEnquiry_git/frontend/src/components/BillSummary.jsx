import PropTypes from 'prop-types';

/**
 * BillSummary Component
 * Displays the bill payment summary after successful payment
 */
function BillSummary({ billSummary, onNewPayment }) {
    // Format transaction date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="bill-summary-container">
            {/* Success animation */}
            <div className="success-animation">
                <div className="success-circle">
                    <div className="checkmark">✓</div>
                </div>
                <div className="energy-pulse"></div>
            </div>

            <h2 className="summary-title">Payment Submitted</h2>

            {/* Pending approval notice */}
            <div className="approval-notice">
                <span className="notice-icon">⏳</span>
                <div className="notice-text">
                    <strong>Pending Admin Approval</strong>
                    <p>Your payment has been submitted successfully and is waiting for admin approval. It will appear in your payment history once approved.</p>
                </div>
            </div>

            {/* Bill details card */}
            <div className="summary-card">
                <div className="summary-header">
                    <h3>Bill Summary</h3>
                    <span className="transaction-id">#{billSummary.transactionId?.slice(-8)}</span>
                </div>

                <div className="summary-details">
                    {/* Consumer ID */}
                    <div className="summary-row">
                        <span className="summary-label">Consumer ID</span>
                        <span className="summary-value">{billSummary.consumerId}</span>
                    </div>

                    {/* Plan Name */}
                    <div className="summary-row">
                        <span className="summary-label">Selected Plan</span>
                        <span className="summary-value electric-text">{billSummary.planName}</span>
                    </div>

                    {/* Units Used */}
                    <div className="summary-row">
                        <span className="summary-label">Units Used</span>
                        <span className="summary-value">{billSummary.unitsUsed} kWh</span>
                    </div>

                    {/* Remaining Units */}
                    <div className="summary-row highlight">
                        <span className="summary-label">Remaining Units</span>
                        <span className="summary-value glow">{billSummary.remainingUnits} kWh</span>
                    </div>

                    {/* Total Amount */}
                    <div className="summary-row total">
                        <span className="summary-label">Total Amount Paid</span>
                        <span className="summary-value amount">₹{billSummary.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Transaction Date */}
                    <div className="summary-row">
                        <span className="summary-label">Transaction Date</span>
                        <span className="summary-value">{formatDate(billSummary.transactionDate)}</span>
                    </div>
                </div>

                {/* Energy flow animation */}
                <div className="flow-animation"></div>
            </div>

            {/* New Payment Button */}
            <button className="new-payment-button" onClick={onNewPayment}>
                <span className="btn-icon">⚡</span>
                Make Another Payment
            </button>
        </div>
    );
}

BillSummary.propTypes = {
    billSummary: PropTypes.shape({
        consumerId: PropTypes.string.isRequired,
        planName: PropTypes.string.isRequired,
        unitsUsed: PropTypes.number.isRequired,
        totalAmount: PropTypes.number.isRequired,
        remainingUnits: PropTypes.number.isRequired,
        transactionId: PropTypes.string,
        transactionDate: PropTypes.string.isRequired
    }).isRequired,
    onNewPayment: PropTypes.func.isRequired
};

export default BillSummary;
