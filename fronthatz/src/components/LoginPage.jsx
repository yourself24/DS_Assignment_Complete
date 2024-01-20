import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext.jsx';
import './LoginPage.css'; // Import the CSS file for styling

function LoginPage({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { setUserId } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                email: email,
                password: password,
            });

            if (response.data.token) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            } else {
                setError('No token received');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    useEffect(() => {
        if (token) {
            const requestData = {
                email: email,
                password: password,
            };

            axios
                .post('http://localhost:8080/api/user/login2', requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const userId = response.data.id;
                    setUserId(userId); // Set userId in a synchronous manner
                    sessionStorage.setItem('userId', userId); // Set userId in a synchronous manner
                    setUserData(response.data);
                })
                .catch((error) => {
                    setError('Error fetching user data: ' + error.message);
                });
        }
    }, [token, email, password, setUserId]);

    // Handle redirects based on user role when userData is available
    useEffect(() => {
        if (userData) {
            if (userData.admin) {
                navigate(`/admin-dashboard/${userData.id}`);
                sessionStorage.setItem('username', userData.name);
            } else {
                navigate(`/user-dashboard/${userData.name}`);
                sessionStorage.setItem('username', userData.name);
            }
        }
    }, [userData, navigate]);

    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {token && <p>Token: {token}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
