import React, { useState } from 'react';

const ShortenURLComponent = () => {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [type, setType] = useState('base62to10');
  const [error, setError] = useState(null);

  const fetchShortURL = async () => {
    try {
      const response = await fetch(`http://localhost:8080/url/shorten/?longURL=${encodeURIComponent(longURL)}&type=${encodeURIComponent(type)}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.text();
      setShortURL(result);
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
          value={longURL}
          onChange={(e) => setLongURL(e.target.value)}
          placeholder="Enter Long URL"
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="base62to10">Base62</option>
          <option value="hash">Hash</option>
        </select>
      </div>
      <button
        onClick={fetchShortURL}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Shorten URL
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {shortURL && <p className="text-green-500">Short URL: {shortURL}</p>}
    </div>
  );
};

export default ShortenURLComponent;