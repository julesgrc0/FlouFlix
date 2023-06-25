import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loading from '../components/Loading';

// import Home from './Home';
// import Video from './Video';

const Home = React.lazy(() => import('./Home'));
const Video = React.lazy(() => import('./Video'));

interface LazyLoadingProps {
    Component: any
};

function LazyLoading({ Component }: LazyLoadingProps)
{
    return <React.Suspense fallback={<Loading />}>
        <Component />
    </React.Suspense>
}

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
                        element={<LazyLoading Component={Video} />}
                        errorElement={<Loading />}
                    />
                    <Route
                        path='/:id'
                        element={<Home />}
                        errorElement={<LazyLoading Component={Home} />}
                    />
                    <Route
                        path='*'
                        element={<Home />}
                        errorElement={<LazyLoading Component={Home} />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}