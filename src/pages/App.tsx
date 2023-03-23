import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loading from '../components/Loading';

import Home from './Home';
import Video from './Video';

export default function App() {
    return (
        <div
            style={{
                background: "#141414",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        path='/video/:id/:index'
                        element={<Video />}
                        errorElement={<Loading />}
                    />
                    <Route
                        path='/:id'
                        element={<Home />}
                        errorElement={<Loading />}
                    />
                    <Route
                        path='*'
                        element={<Home />}
                        errorElement={<Loading />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}