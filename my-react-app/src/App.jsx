// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import QRCodeComponent from './components/QRCodeComponent';
import ShortenURLComponent from './components/ShortenURLComponent';
import UserAuthComponent from './components/UserAuthComponent';
import HeroComponent from './components/HeroComponent';
import QRCodeList from "./components/QRCodeList.jsx";

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const localUsername = localStorage.getItem('username');
    if (localUsername) {
      setUsername(localUsername);
    }
  }, []);

  return (
    <Router>
      <HeaderComponent username={username} setUsername={setUsername} />
      <Routes>
        <Route path="/qr-code" element={<QRCodeComponent />} />
        <Route path="/shorten-url" element={<ShortenURLComponent />} />
        <Route path="/login" element={<UserAuthComponent setUsername={setUsername} />} />
        <Route path="/" element={<HeroComponent />} />
        <Route path="/qrlist" element={<QRCodeList username={username}/>} />
      </Routes>
    </Router>
  );
}

export default App;