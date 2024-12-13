import React, { useState,useEffect } from 'react'
import ChatContact from './ChatContact'
import ChatWindow from './ChatWindow'
import { UseAuth } from '../Context/AuthContext'

const ChatPage = () => {

  const {currentUser,logout,clicked} = UseAuth()
  const [username,setUsername] = useState(null);
  const [email,setEmail] = useState(null);
  const [uid,setUid] = useState()
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 750);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setUid(currentUser.uid);
    }
  }, [currentUser]);


  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 750);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // model close

  return (
    <>
    
    <div className='chatpage'>

       {
        isScreenSmall?
        (
          <div className='main-window'>
          <div className='menuDiv'> 
          <div className='menuDivContent'>
          <i className="fa-solid fa-lg fa-user userBtn" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style={{color: "#ffffff",cursor:"pointer"}}></i>
          <i className="fa-solid fa-lg fa-bell" style={{color:"#ffffff",cursor:"pointer"}} ></i>
          <i className="fa-brands fa-lg fa-github" style={{color:"#ffffff",cursor:"pointer"}}>
          </i>
          </div>
          <i className="fa-solid fa-lg fa-right-from-bracket" style={{color: "#201e1e",cursor:"pointer"}} onClick={logout,toast(}></i>
          </div>
          <hr className='hr2' style={{width:"2px" , transform:"rotate(180deg)", backgroundColor:"black"}}/>
          {
            clicked?
            (<ChatWindow/>)
            :
            (<ChatContact/>)
          }
        </div>
        )
        :
        (
          <div className='main-window'>
          <div className='menuDiv'> 
          <i className="fa-solid fa-bars fa-lg menuBtn"></i>
          <div className='menuDivContent'>
          <i className="fa-solid fa-lg fa-user" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style={{color: "#ffffff",cursor:"pointer"}}></i>
          <i className="fa-solid fa-lg fa-bell" style={{color:"#ffffff",cursor:"pointer"}} ></i>
          <i className="fa-brands fa-lg fa-github" style={{color:"#ffffff",cursor:"pointer"}}>
          </i>
          </div>
          <i className="fa-solid fa-lg fa-right-from-bracket" style={{color: "#201e1e",cursor:"pointer"}} onClick={logout}></i>
          </div>
          <hr className='hr2' style={{width:"2px" , transform:"rotate(180deg)", backgroundColor:"black"}}/>
        <ChatContact/>
        <hr className='hr1' style={{width:"2px" , transform:"rotate(180deg)", backgroundColor:"black"}}/>
            <ChatWindow/>
        </div>
        )
       }
   
    </div>

    {/* Models */}
     {/*Profile Model Start */}
     <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content profile-model-content">
      <div className="modal-body profile-model-body"> 
        <div className='profile-photo'style={{backgroundImage:"URL('https://images.unsplash.com/photo-1606335192038-f5a05f761b3a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize:"cover", backgroundRepeat:"no-repeat"}}></div>
        <div className='m-3'>
          <p className='m-0 fw-bold'>Your Name</p>
          <p className='m-0'>{username}</p>
        </div>
        <div className='m-3'>
          <p className='m-0 fw-bold'>Your Email</p>
          <p className='m-0'>{email}</p>
        </div>
        <div className='m-3'>
          <p className='m-0 fw-bold'>UID</p>
          <p className='m-0'>{uid}</p>
        </div>
        <div className='w-100 d-flex justify-content-center mt-4'>
          <button className='btn btn-danger btn-sm' onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  </div>
</div>
     {/*Profile Model end */}

    </>
  )
}

export default ChatPage