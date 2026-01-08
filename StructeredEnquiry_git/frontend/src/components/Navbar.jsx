import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar Component
 * Navigation header with user menu
 */
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                    <span className="navbar-icon">⚡</span>
                    <span className="navbar-title">PowerGrid</span>
                </Link>
            </div>

            <div className="navbar-menu">
                {user && (
                    <>
                        <div className="user-info">
                            <span className="user-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
                            <span className="user-name">{user.fullName}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
