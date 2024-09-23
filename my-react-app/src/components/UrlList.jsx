import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const UrlList = () => {
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.sub);
        }
    }, []);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/url/myUrls', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                if (Array.isArray(response.data)) {
                    setUrls(response.data);
                } else {
                    setError('Invalid response format');
                }
            } catch (error) {
                setError('Error fetching URLs');
            }
        };

        if (username) {
            fetchUrls();
        }
    }, [username]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`http://localhost:8080/url/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUrls(urls.filter(url => url.id !== id));
        } catch (error) {
            setError('Error deleting URL');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-16">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">URLs for {username}</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex flex-col gap-4">
                    {urls.map(url => (
                        <div key={url.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col relative mb-4">
                            <div className="flex flex-col mb-4">
                                <p className="text-gray-700 font-semibold">
                                    URL: {url.longURL.length > 20 ? `${url.longURL.substring(0, 20)}...` : url.longURL}
                                </p>
                                {url.shortURL && (
                                    <a href={url.shortURL} className="text-blue-500 hover:underline">{url.shortURL}</a>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(url.id)}
                                className="absolute bottom-2 right-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

UrlList.propTypes = {
    username: PropTypes.string.isRequired,
};

export default UrlList;