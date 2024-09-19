import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const QRCodeList = () => {
    const [qrCodes, setQRCodes] = useState([]);
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
        const fetchQRCodes = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/qr/myQR', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (Array.isArray(response.data)) {
                    setQRCodes(response.data);
                } else {
                    setError('Invalid response format');
                }
            } catch (error) {
                setError('Error fetching QR codes');
            }
        };

        if (username) {
            fetchQRCodes();
        }
    }, [username]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`http://localhost:8080/qr/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setQRCodes(qrCodes.filter(qrCode => qrCode.id !== id));
        } catch (error) {
            setError('Error deleting QR code');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-16">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">QR Codes for {username}</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex flex-col gap-4">
                    {qrCodes.map(qrCode => (
                        <div key={qrCode.id} className="bg-white p-4 rounded-lg shadow-md flex flex-row justify-between items-center relative">
                            <div className="flex flex-col">
                                <p className="mb-2 text-gray-700 font-semibold">
                                    QR Code for {qrCode.url.length > 20 ? `${qrCode.url.substring(0, 20)}...` : qrCode.url}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src={`data:image/png;base64,${qrCode.qrCodeBase64}`} alt="QR Code" className="w-24 h-24 mb-4" />
                            </div>
                            <button
                                onClick={() => handleDelete(qrCode.id)}
                                className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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

QRCodeList.propTypes = {
    username: PropTypes.string.isRequired,
};

export default QRCodeList;