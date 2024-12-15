import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './components/miscellaneous/ChatPage';
import { UseAuth } from './components/Context/AuthContext';
import UserLogin from './components/authencation/UserLogin';
import UserRegister from './components/authencation/UserRegister';
function App() {
  const {isAuthenticated} = UseAuth()
  return (
    
    <Router>
      <Routes>
      <Route path='/' element={isAuthenticated?<ChatPage/>:<Navigate to='/login'/>}/> 
      <Route path='/login' element={isAuthenticated? <Navigate to='/'/>:<UserLogin/>}/>
      <Route path='/register' element={<UserRegister/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
