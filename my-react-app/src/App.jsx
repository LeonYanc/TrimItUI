import React from 'react';
import QRCodeComponent from './components/QRCodeComponent';
import ShortenURLComponent from './components/ShortenURLComponent';
import Header from './components/HeaderComponent';
import Hero from './components/HeroComponent';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
    return (

        <Router>
            <Routes>
                <Route path={"/"} element={<Hero/>}/>
                <Route path={"/qr-code"} element={<div><Header /><QRCodeComponent/></div>}/>
                <Route path={"/shorten-url"} element={<div><Header /><ShortenURLComponent/></div>}/>
            </Routes>
        </Router>
    );
}

export default App;