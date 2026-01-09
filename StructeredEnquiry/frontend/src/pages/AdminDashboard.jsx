import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Dashboard.css';

/**
 * AdminDashboard Component
 * Admin panel with user management and payment approval
 */
const AdminDashboard = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPayments: 0,
        pendingPayments: 0,
        totalRevenue: 0
    });
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all users
            const usersRes = await fetch('http://localhost:3000/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Fetch all payments
            const paymentsRes = await fetch('http://localhost:3000/api/payments/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Fetch pending payments
            const pendingRes = await fetch('http://localhost:3000/api/payments/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData.users || []);
                setStats(prev => ({ ...prev, totalUsers: usersData.users?.length || 0 }));
            }

            if (paymentsRes.ok) {
                const paymentsData = await paymentsRes.json();
                const allPayments = paymentsData.payments || [];
                setPayments(allPayments);

                const totalRevenue = allPayments
                    .filter(p => p.approvalStatus === 'approved')
                    .reduce((sum, p) => sum + (p.amountPaid || 0), 0);
                setStats(prev => ({
                    ...prev,
                    totalPayments: allPayments.length,
                    totalRevenue
                }));
            }

            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                setPendingPayments(pendingData.payments || []);
                setStats(prev => ({ ...prev, pendingPayments: pendingData.payments?.length || 0 }));
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (paymentId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/payments/${paymentId}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Refresh data
                fetchDashboardData();
            }
        } catch (err) {
            console.error('Failed to approve payment:', err);
        }
    };

    const handleReject = async (paymentId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/payments/${paymentId}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Refresh data
                fetchDashboardData();
            }
        } catch (err) {
            console.error('Failed to reject payment:', err);
        }
    };

    return (
        <div className="dashboard-container admin-dashboard">
            <Navbar />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage users and approve payments</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon users-icon">👥</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.totalUsers}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon payments-icon">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.totalPayments}</span>
                            <span className="stat-label">Total Payments</span>
                        </div>
                    </div>
                    <div className="stat-card stat-pending">
                        <div className="stat-icon pending-icon">⏳</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.pendingPayments}</span>
                            <span className="stat-label">Pending Approvals</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon revenue-icon">💰</div>
                        <div className="stat-info">
                            <span className="stat-value">₹{stats.totalRevenue.toFixed(2)}</span>
                            <span className="stat-label">Approved Revenue</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals
                        {stats.pendingPayments > 0 && (
                            <span className="badge">{stats.pendingPayments}</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        All Payments
                    </button>
                </div>

                <div className="dashboard-content">
                    {loading ? (
                        <div className="loading-box">
                            <div className="spinner"></div>
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="overview-grid">
                                    <section className="dashboard-section">
                                        <div className="section-header">
                                            <h2>👥 Recent Users</h2>
                                        </div>
                                        {users.slice(0, 5).length > 0 ? (
                                            <div className="users-list">
                                                {users.slice(0, 5).map((u, idx) => (
                                                    <div key={u._id || idx} className="user-item">
                                                        <div className="user-avatar">{u.fullName?.charAt(0).toUpperCase()}</div>
                                                        <div className="user-details">
                                                            <span className="user-name">{u.fullName}</span>
                                                            <span className="user-email">{u.email}</span>
                                                        </div>
                                                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <p>No users yet</p>
                                            </div>
                                        )}
                                    </section>

                                    <section className="dashboard-section">
                                        <div className="section-header">
                                            <h2>⏳ Pending Approvals</h2>
                                        </div>
                                        {pendingPayments.slice(0, 5).length > 0 ? (
                                            <div className="payments-list">
                                                {pendingPayments.slice(0, 5).map((p, idx) => (
                                                    <div key={p._id || idx} className="payment-item payment-pending">
                                                        <div className="payment-info">
                                                            <span className="payment-name">{p.consumerId}</span>
                                                            <span className="payment-plan">{p.planName} • {p.unitsUsed} units</span>
                                                        </div>
                                                        <div className="payment-amount">₹{p.amountPaid?.toFixed(2)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <p>No pending payments</p>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}

                            {/* Pending Approvals Tab */}
                            {activeTab === 'pending' && (
                                <section className="dashboard-section full-width">
                                    <div className="section-header">
                                        <h2>⏳ Pending Payment Approvals</h2>
                                    </div>
                                    {pendingPayments.length > 0 ? (
                                        <div className="table-wrapper">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Consumer</th>
                                                        <th>Plan</th>
                                                        <th>Units</th>
                                                        <th>Amount</th>
                                                        <th>Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingPayments.map((p, idx) => (
                                                        <tr key={p._id || idx}>
                                                            <td>{p.consumerId}</td>
                                                            <td>{p.planName}</td>
                                                            <td>{p.unitsUsed}</td>
                                                            <td>₹{p.amountPaid?.toFixed(2)}</td>
                                                            <td>{new Date(p.transactionDate).toLocaleDateString()}</td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    <button
                                                                        className="btn-approve"
                                                                        onClick={() => handleApprove(p._id)}
                                                                    >
                                                                        ✓ Approve
                                                                    </button>
                                                                    <button
                                                                        className="btn-reject"
                                                                        onClick={() => handleReject(p._id)}
                                                                    >
                                                                        ✗ Reject
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <p>No pending payments</p>
                                            <span>All payments have been processed</span>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <section className="dashboard-section full-width">
                                    <div className="section-header">
                                        <h2>👥 All Users</h2>
                                    </div>
                                    {users.length > 0 ? (
                                        <div className="table-wrapper">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Joined</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((u, idx) => (
                                                        <tr key={u._id || idx}>
                                                            <td>
                                                                <div className="cell-with-avatar">
                                                                    <span className="mini-avatar">{u.fullName?.charAt(0).toUpperCase()}</span>
                                                                    {u.fullName}
                                                                </div>
                                                            </td>
                                                            <td>{u.email}</td>
                                                            <td>
                                                                <span className={`role-badge ${u.role}`}>{u.role}</span>
                                                            </td>
                                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <p>No users found</p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Payments Tab */}
                            {activeTab === 'payments' && (
                                <section className="dashboard-section full-width">
                                    <div className="section-header">
                                        <h2>All Payments</h2>
                                    </div>
                                    {payments.length > 0 ? (
                                        <div className="table-wrapper">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Consumer</th>
                                                        <th>Plan</th>
                                                        <th>Units</th>
                                                        <th>Amount</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map((p, idx) => (
                                                        <tr key={p._id || idx}>
                                                            <td>{p.consumerId}</td>
                                                            <td>{p.planName}</td>
                                                            <td>{p.unitsUsed}</td>
                                                            <td>₹{p.amountPaid?.toFixed(2)}</td>
                                                            <td>{new Date(p.transactionDate).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={`status-badge ${p.approvalStatus || p.paymentStatus}`}>
                                                                    {p.approvalStatus || p.paymentStatus}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <p>No payments found</p>
                                        </div>
                                    )}
                                </section>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
