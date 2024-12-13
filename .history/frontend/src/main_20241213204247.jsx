import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { AuthProvider } from './components/Context/AuthContext.jsx'
import { SocketContextProvider } from './components/Context/SocketContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketContextProvider>
    <App />
    <ToastContainer
position="bottom-right"
autoClose={5000}
limit={1}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition: Flip,
/>
    </SocketContextProvider>
  </AuthProvider>
)
