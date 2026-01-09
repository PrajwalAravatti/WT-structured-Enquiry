import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * SignupPage Component
 * User registration form
 */
const SignupPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (fullName.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await signup(fullName, email, password, role);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-effects">
                <div className="electric-bolt bolt-1"></div>
                <div className="electric-bolt bolt-2"></div>
                <div className="electric-bolt bolt-3"></div>
            </div>

            <div className="auth-card signup-card">
                <div className="auth-header">
                    <div className="auth-logo"></div>
                    <h1>Create Account</h1>
                    <p>Join PowerGrid electricity system</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="auth-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create password"
                                className="auth-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="auth-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Account Type</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${role === 'user' ? 'active' : ''}`}
                                onClick={() => setRole('user')}
                            >
                                <span className="role-icon">👤</span>
                                <span className="role-label">User</span>
                                <span className="role-desc">Pay bills & view history</span>
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                                onClick={() => setRole('admin')}
                            >
                                <span className="role-icon">⚙️</span>
                                <span className="role-label">Admin</span>
                                <span className="role-desc">Manage users & payments</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon"></span>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
