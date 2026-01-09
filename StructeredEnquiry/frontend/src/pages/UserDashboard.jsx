import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ElectricityPlans from '../components/ElectricityPlans';
import BillSummary from '../components/BillSummary';
import './Dashboard.css';

/**
 * UserDashboard Component
 * User's main dashboard with bill payment and history
 */
const UserDashboard = () => {
    const { user, token } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [consumerId, setConsumerId] = useState('');
    const [unitsUsed, setUnitsUsed] = useState('');
    const [billSummary, setBillSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Fetch payment history on mount
    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPaymentHistory(data.payments || []);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handlePayBill = async () => {
        setError('');

        if (!consumerId.trim()) {
            setError('Please enter consumer ID');
            return;
        }

        if (!selectedPlan) {
            setError('Please select an electricity plan');
            return;
        }

        if (!unitsUsed || unitsUsed <= 0) {
            setError('Please enter valid units used');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/paybill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    consumerId,
                    planName: selectedPlan.planName,
                    unitsUsed: parseFloat(unitsUsed)
                })
            });

            const data = await response.json();

            if (response.ok && data.paymentStatus === 'success') {
                setBillSummary({
                    consumerId,
                    planName: selectedPlan.planName,
                    unitsUsed: parseFloat(unitsUsed),
                    totalAmount: data.totalAmount,
                    remainingUnits: data.remainingUnits,
                    transactionId: data.transactionId,
                    transactionDate: data.transactionDate
                });
                fetchPaymentHistory(); // Refresh history
            } else {
                setError(data.message || 'Payment failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewPayment = () => {
        setBillSummary(null);
        setConsumerId('');
        setUnitsUsed('');
        setSelectedPlan(null);
        setError('');
    };

    return (
        <div className="dashboard-container">
            <Navbar />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Welcome, {user?.fullName}</h1>
                    <p>Manage your electricity bills and payments</p>
                </div>

                <div className="dashboard-content">
                    {/* Payment Section */}
                    <section className="dashboard-section payment-section">
                        <div className="section-header">
                            <h2>Pay Your Bill</h2>
                        </div>

                        {billSummary ? (
                            <BillSummary
                                billSummary={billSummary}
                                onNewPayment={handleNewPayment}
                            />
                        ) : (
                            <div className="payment-form-card">
                                <div className="form-group">
                                    <label htmlFor="consumerId">Consumer ID</label>
                                    <input
                                        id="consumerId"
                                        type="text"
                                        placeholder="Enter your consumer ID"
                                        value={consumerId}
                                        onChange={(e) => setConsumerId(e.target.value)}
                                        className="dashboard-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="unitsUsed">Units Used</label>
                                    <input
                                        id="unitsUsed"
                                        type="number"
                                        placeholder="Enter units consumed"
                                        value={unitsUsed}
                                        onChange={(e) => setUnitsUsed(e.target.value)}
                                        className="dashboard-input"
                                        min="0"
                                    />
                                </div>

                                <ElectricityPlans
                                    selectedPlan={selectedPlan}
                                    onSelectPlan={setSelectedPlan}
                                />

                                {error && (
                                    <div className="error-message">
                                        <span className="error-icon">!</span>
                                        {error}
                                    </div>
                                )}

                                <button
                                    className="pay-btn"
                                    onClick={handlePayBill}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay Bill
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Payment History Section */}
                    <section className="dashboard-section history-section">
                        <div className="section-header">
                            <h2>📋 Payment History</h2>
                        </div>

                        {loadingHistory ? (
                            <div className="loading-box">
                                <div className="spinner"></div>
                                <p>Loading history...</p>
                            </div>
                        ) : paymentHistory.length > 0 ? (
                            <div className="history-table-wrapper">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Consumer ID</th>
                                            <th>Plan</th>
                                            <th>Units</th>
                                            <th>Amount</th>
                                            <th>Payment Status</th>
                                            <th>Approval Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((payment, index) => (
                                            <tr key={payment._id || index}>
                                                <td>{new Date(payment.transactionDate).toLocaleDateString()}</td>
                                                <td>{payment.consumerId}</td>
                                                <td>{payment.planName}</td>
                                                <td>{payment.unitsUsed}</td>
                                                <td>₹{payment.amountPaid?.toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${payment.paymentStatus}`}>
                                                        {payment.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${payment.approvalStatus || 'pending'}`}>
                                                        {payment.approvalStatus || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No payment history yet</p>
                                <span>Your payments will appear here</span>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
