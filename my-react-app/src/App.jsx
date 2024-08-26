import React from 'react';
import QRCodeComponent from './components/QRCodeComponent';
import ShortenURLComponent from './components/ShortenURLComponent';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-row space-x-8">
        <div className="bg-fuchsia-100 p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
          <QRCodeComponent />
        </div>
        <div className="bg-teal-100 p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
          <ShortenURLComponent />
        </div>
      </div>
    </div>
  );
}

export default App;