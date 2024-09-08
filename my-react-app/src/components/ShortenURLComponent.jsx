// ShortenURLComponent.jsx
import React, { useState } from 'react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/16/solid";
import axios from 'axios';

const ShortenURLComponent = () => {
    const [longURL, setLongURL] = useState('');
    const [shortURL, setShortURL] = useState('');
    const [type, setType] = useState('base62to10');
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const fetchShortURL = async () => {
        if (!isValidURL(longURL)) {
            setError('Invalid URL');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/url/shorten/`,
                { longURL, type },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setShortURL(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortURL).then(() => {
            setCopySuccess(<CheckCircleIcon className="h-5 w-5 text-green-500" />);
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy!');
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">URL Shortener</h1>
                <div className="flex flex-col items-center p-4">
                    <div className="flex mb-4 space-x-2 w-full">
                        <input
                            type="text"
                            value={longURL}
                            onChange={(e) => setLongURL(e.target.value)}
                            placeholder="Enter Long URL"
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="base62to10">Base62</option>
                            <option value="hash">Hash</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <button
                        onClick={fetchShortURL}
                        className="mb-4 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                    >
                        Shorten URL
                    </button>
                    {error && <div className="flex items-center text-red-500">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2"/>
                        <p>{error}</p>
                    </div>}
                    {shortURL && (
                        <div className="flex items-center space-x-2">
                            <p className="text-green-500">Short URL: {shortURL}</p>
                            <button
                                onClick={copyToClipboard}
                                className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                <DocumentDuplicateIcon className="h-5 w-5"/>
                            </button>
                            {copySuccess && <span className="text-gray-500">{copySuccess}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShortenURLComponent;