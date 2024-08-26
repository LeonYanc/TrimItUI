import React, { useState } from 'react';

const GenerateQRCodeComponent = () => {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState(null);

  const fetchQRCode = async () => {
    try {
      const response = await fetch(`http://localhost:8080/url/generateQR/?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.text();
      setQrCode(result);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={fetchQRCode}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Generate QR Code
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
    </div>
  );
};

export default GenerateQRCodeComponent;