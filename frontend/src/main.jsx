import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { AuthProvider } from './components/Context/AuthContext.jsx'
import { SocketContextProvider } from './components/Context/SocketContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
  </AuthProvider>
)
