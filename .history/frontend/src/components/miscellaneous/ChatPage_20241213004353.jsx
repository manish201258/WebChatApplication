import React, { useState, useEffect } from 'react';
import { UseAuth } from '../Context/AuthContext';
import ChatContact from './ChatContact';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
  const { currentUser, logout, clicked, setClicked } = UseAuth();
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 750);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // To keep track of the screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 750);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load clicked state from localStorage
  useEffect(() => {
    const savedClicked = localStorage.getItem('clicked');
    if (savedClicked) {
      setClicked(savedClicked); // Restore state from localStorage
    }
  }, [setClicked]);

  // Save clicked state to localStorage when it changes
  useEffect(() => {
    if (clicked !== null) {
      localStorage.setItem('clicked', clicked);
    }
  }, [clicked]);

  return (
    <div className='chatpage'>
      {isScreenSmall ? (
        <div className='main-window'>
          <div className='menuDiv'>
            <div className='menuDivContent'>
              <i className="fa-solid fa-lg fa-user userBtn" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style={{ color: "#ffffff", cursor: "pointer" }}></i>
              <i className="fa-solid fa-lg fa-bell" style={{ color: "#ffffff", cursor: "pointer" }}></i>
              <i className="fa-brands fa-lg fa-github" style={{ color: "#ffffff", cursor: "pointer" }}></i>
            </div>
            <i className="fa-solid fa-lg fa-right-from-bracket" style={{ color: "#201e1e", cursor: "pointer" }} onClick={logout}></i>
          </div>
          <hr className='hr2' style={{ width: "2px", transform: "rotate(180deg)", backgroundColor: "black" }} />
          {clicked !== null ? <ChatWindow /> : <ChatContact />}
        </div>
      ) : (
        <div className='main-window'>
          <div className='menuDiv'>
            <i className="fa-solid fa-bars fa-lg menuBtn"></i>
            <div className='menuDivContent'>
              <i className="fa-solid fa-lg fa-user" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style={{ color: "#ffffff", cursor: "pointer" }}></i>
              <i className="fa-solid fa-lg fa-bell" style={{ color: "#ffffff", cursor: "pointer" }}></i>
              <i className="fa-brands fa-lg fa-github" style={{ color: "#ffffff", cursor: "pointer" }}></i>
            </div>
            <i className="fa-solid fa-lg fa-right-from-bracket" style={{ color: "#201e1e", cursor: "pointer" }} onClick={logout}></i>
          </div>
          <hr className='hr2' style={{ width: "2px", transform: "rotate(180deg)", backgroundColor: "black" }} />
          <ChatContact />
          <hr className='hr1' style={{ width: "2px", transform: "rotate(180deg)", backgroundColor: "black" }} />
          <ChatWindow />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
