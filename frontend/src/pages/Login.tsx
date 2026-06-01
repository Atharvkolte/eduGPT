import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            navigate('/');
        } else {
            setError('Invalid credentials. Try admin/admin');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1 className="login-title">StudyAntra</h1>
                <p className="login-subtitle">
                    Welcome back! please sign in.
                </p>

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    >
                        Student
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                    >
                        Teacher
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && <div className="error">{error}</div>}

                    {/* Helper text */}
                    <div style={{ fontSize: "12px", marginTop:"4px", marginBottom: "18px", color: "#647488" }}>
                        Use admin / admin (Select role above)
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In as {role}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;