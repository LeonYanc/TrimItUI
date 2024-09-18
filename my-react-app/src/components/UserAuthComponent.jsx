import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserAuthComponent = ({ setUsername }) => {
    const [localUsername, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.sub);
            setIsLoggedIn(true);
        }
    }, [setUsername]);

    const handleRegister = async () => {
        try {
            await axios.post(
                'http://localhost:8080/api/users/register',
                { username: localUsername, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setSuccess('Registration successful!');
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/users/login',
                { username: localUsername, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const token = response.data;
            localStorage.setItem('jwtToken', token);
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.sub);
            setIsLoggedIn(true);
            setSuccess('Login successful!');
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUsername('');
        setIsLoggedIn(false);
        setSuccess('Logged out successfully!');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">User Authentication</h1>
                <div className="flex flex-col items-center p-4">
                    {!isLoggedIn && (
                        <>
                            <div className="flex mb-4 space-x-2 w-full">
                                <input
                                    type="text"
                                    value={localUsername}
                                    onChange={(e) => setLocalUsername(e.target.value)}
                                    placeholder="Enter Username"
                                    className="p-2 border border-gray-300 rounded w-full"
                                />
                            </div>
                            <div className="flex mb-4 space-x-2 w-full">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="p-2 border border-gray-300 rounded w-full"
                                />
                            </div>
                            <button
                                onClick={handleRegister}
                                className="mb-4 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                            >
                                Register
                            </button>
                            <button
                                onClick={handleLogin}
                                className="mb-4 p-2 bg-green-600 text-white rounded hover:bg-green-500"
                            >
                                Login
                            </button>
                        </>
                    )}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="mb-4 p-2 bg-red-600 text-white rounded hover:bg-red-500"
                        >
                            Logout
                        </button>
                    )}
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                </div>
            </div>
        </div>
    );
};

UserAuthComponent.propTypes = {
    setUsername: PropTypes.func.isRequired,
};

export default UserAuthComponent;