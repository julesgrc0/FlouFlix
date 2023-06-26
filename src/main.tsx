import React from 'react';
import ReactDOM from 'react-dom/client';

import('./pages/App').then((app)=>{
  ReactDOM.createRoot(document.getElementById('root') ?? document.createElement("div"))
    .render(
      <React.StrictMode>
        <app.default />
      </React.StrictMode>,
    )
})

