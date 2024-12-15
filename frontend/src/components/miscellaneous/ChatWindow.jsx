import React, { useEffect, useState } from "react";
import { UseAuth } from "../Context/AuthContext.jsx";
import ChatBox from "./ChatBox.jsx";
import { UseSocketContext } from "../Context/SocketContext.jsx";

const ChatWindow = () => {
  const { chatPerson, isAuthenticated, clicked, deleteConversation,blockConversation,unblockConversation,blockedUsers,allBlockedData,setClicked} = UseAuth();

  const {onlineUsers} = UseSocketContext()

  let isOnline;
  if(onlineUsers)
   isOnline= onlineUsers.includes(clicked)


  useEffect(() => {
    if (clicked === null) {
      // Hide the modal programmatically
      const modalElement = document.getElementById("chatPersonProfile");
      const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
  
      if (bootstrapModal) {
        bootstrapModal.hide(); // Hide modal
      }
  
      // Ensure backdrop removal
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
  
      // Reset modal open class on body
      document.body.classList.remove("modal-open");
      document.body.style.overflow = ""; // Reset overflow in case it's blocked
    }
  }, [clicked]);

  useEffect(()=>{
    allBlockedData()
  },[])

    // For Mobile chat toogle

    const toogleChat = ()=>{
      setClicked(null);
    }
  
  return (
      <div className="chatwindow">
        {isAuthenticated && clicked == null ? (
          <div className="h-100 d-flex justify-content-center align-items-center position-relative">
            <div>
              <p>
                Welcome 👋 to <span className="fw-bold">ChatterBoxed</span>
              </p>
              <p>Select a Chat to start messaging</p>
              <p style={{ textAlign: "center", fontSize: "30px" }}>💬</p>
            </div>
            <div className='toogleChats' onClick={toogleChat}>
      <i className="fa-solid fa-shuffle fa-lg" style={{color: "#ffffff"}}></i>
      </div>
          </div>
        ) : (
          <div className="nav-chat">
            <div className="chatWindowNav d-flex align-items-center justify-content-between ps-4 pe-4">
              
              <div
                className="modal fade"
                id="chatPersonProfile"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel"
                tabIndex="-1">
                  
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content profile-model-content">
                    <div className="modal-body profile-model-body">
                      <div
                        className="profile-photo"
                        style={{
                          backgroundImage:
                            "URL('https://static.vecteezy.com/system/resources/previews/030/694/430/non_2x/top-2d-cartoon-vector-illustration-on-white-background-hig-free-photo.jpg')",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}

                      ></div>
                      <div className="m-3">
                        <p className="m-0 fw-bold">Name</p>
                        <p className="m-0">{chatPerson[0].username.toUpperCase()}</p>
                      </div>
                      <div className="m-3">
                        <p className="m-0 fw-bold">Email</p>
                        <p className="m-0">{chatPerson[0].email}</p>
                      </div>
                      <div className="d-flex justify-content-center mt-4">
                        {
                          blockedUsers.includes(chatPerson[0]._id)
                          ?
                          (<button className="btn btn-success btn-sm" onClick={()=>unblockConversation(chatPerson[0]._id)}>Unblock</button>)
                          :
                          (<button className="btn btn-warning btn-sm" onClick={()=>blockConversation(chatPerson[0]._id)}>Block</button>)
                        }
                        
                        <hr
                          style={{
                            transform: "rotate(90deg)",
                            width: "1.8rem",
                            border: "1px solid black",
                          }}
                        />
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteConversation(chatPerson[0]._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-1 align-items-center" data-bs-target="#chatPersonProfile"
                  data-bs-toggle="modal" style={{cursor:"pointer"}}>
                <div
                  className="profile"
                  style={{
                    backgroundImage:
                      "URL('https://static.vecteezy.com/system/resources/previews/030/694/430/non_2x/top-2d-cartoon-vector-illustration-on-white-background-hig-free-photo.jpg')",
                    backgroundSize: "contain",
                  }}
                ></div>
                <hr style={{width:"1.5rem",margin:"0px",padding:"0px",transform:"rotate(90deg)"}}/>
                {/* Modal end */}
                {
                  isOnline?
                  (
                    <div className="lh-1">
                      <p className="m-0">{chatPerson[0].username.toUpperCase()}</p>
                      <p className="m-0 mt-1 text-secondary">Online</p>
                    </div>
                  )
                  :
                  (
                    <p className="m-0">{chatPerson[0].username.toUpperCase()}</p>
                  )
                }
                
              </div>
              <div>
                <div className="dropdown">
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" ,transition:"dropdown 2s all"}}
                  ></i>

                  <ul className="dropdown-menu top-100" style={{ width: "fit-content"}}>
                    <li>
                      <p
                        className="m-0 text-center"
                        data-bs-target="#chatPersonProfile"
                        data-bs-toggle="modal"
                      >
                        About
                      </p>
                    </li>
                    <hr className="m-1" />
                    <li>
                      {
                        blockedUsers.includes(chatPerson[0]._id)?
                        (<p className="m-0 text-center" onClick={()=>unblockConversation(chatPerson[0]._id)}>Unblock</p>)
                        :
                        (<p className="m-0 text-center" onClick={()=>blockConversation(chatPerson[0]._id)}>Block</p>)
                      }
                    </li>
                    <hr className="m-1" />
                    <li>
                      <p
                        className="m-0 text-center"
                        onClick={() => deleteConversation(chatPerson[0]._id)}
                      >
                        Delete
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>   
            <ChatBox/>
          </div>
        )}
      </div>
  );
};

export default ChatWindow;