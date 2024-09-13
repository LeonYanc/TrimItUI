import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {jwtDecode} from "jwt-decode";

const QRCodeList = ({}) => {
    const [qrCodes, setQRCodes] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
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
                console.log("Received Response", response.data);
                if (Array.isArray(response.data)) {
                    setQRCodes(response.data);
                } else {
                    console.error('API response is not an array', response.data);
                    setError('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching QR codes', error);
                setError('Error fetching QR codes');
            }
        };


        if (username) {
            fetchQRCodes();
        }
    }, [username]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">QR Codes for {username}</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {qrCodes.map(qrCode => (
                        <div key={qrCode.id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <p className="mb-2 text-gray-700">Data: {qrCode.url}</p>
                            <img src={`data:image/png;base64,${qrCode.qrCodeBase64}`} alt="QR Code" className="w-full h-auto" />
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