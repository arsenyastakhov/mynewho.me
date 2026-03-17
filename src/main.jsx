import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PropertyProvider } from './contexts/PropertyContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PropertyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PropertyProvider>
  </React.StrictMode>,
)
