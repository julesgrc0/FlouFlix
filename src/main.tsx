import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './pages/App';

const theme= extendTheme({
  
})

const root = document.getElementById('root');
ReactDOM.createRoot(root ?? document.createElement("div")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
