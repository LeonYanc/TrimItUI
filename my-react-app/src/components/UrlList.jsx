import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

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

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'longURL', headerName: 'Long URL', width: 300 },
        { field: 'shortURL', headerName: 'Short URL', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-16">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">URLs for {username}</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={urls}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </div>
            </div>
        </div>
    );
};

UrlList.propTypes = {
    username: PropTypes.string.isRequired,
};

export default UrlList;