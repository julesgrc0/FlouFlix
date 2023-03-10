import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Video from './pages/Video';
import Home from './pages/Home';

export default function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="*" element={<Home />} />
            <Route path="video/:id" element={<Video />} />
        </Routes>
    </BrowserRouter>
}