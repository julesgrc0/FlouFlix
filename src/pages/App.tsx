import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const Home = React.lazy(() => import('./Home'));
const Video = React.lazy(() => import('./Video'));

const theme = extendTheme({});

export default function App() {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            background: "#141414"
        }}>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <React.Suspense>
                        <Routes>
                            <Route
                                path='/video/:id/:index'
                                element={<Video />}
                            />
                            <Route
                                path='/:id'
                                element={<Home />}
                            />
                            <Route
                                path='*'
                                element={<Home />}
                            />
                        </Routes>
                    </React.Suspense>
                </BrowserRouter>
            </ChakraProvider>
        </div>
    )
}