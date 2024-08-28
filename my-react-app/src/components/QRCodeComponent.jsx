// QRCodeComponent.jsx
import React, { useState } from 'react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const QRCodeComponent = () => {
    const [url, setUrl] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState(null);

    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const fetchQRCode = async () => {
        if (!isValidURL(url)) {
            setError('Invalid URL');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/url/generateQR/`, {
                params: { url: encodeURIComponent(url) }
            });
            setQrCode(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">QR Code Generator</h1>
                <div className="flex flex-col items-center p-4">
                    <div className="flex mb-4 space-x-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL"
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <button
                        onClick={fetchQRCode}
                        className="mb-4 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                    >
                        Generate QR Code
                    </button>

                    {error && <div className="flex items-center text-red-500">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2"/>
                        <p>{error}</p>
                    </div>}
                    {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="mt-4 border border-gray-300 rounded"/>}
                </div>
            </div>
        </div>
    );
};

export default QRCodeComponent;