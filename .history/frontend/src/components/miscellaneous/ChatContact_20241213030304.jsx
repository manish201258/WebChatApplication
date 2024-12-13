import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UseAuth } from "../Context/AuthContext";
import axios from "axios";
import { UseSocketContext } from "../Context/SocketContext";

const ChatContact = () => {
  const {
    currentUser,
    sideUser,
    sideClicked,
    userSideData,
    clicked,
    deleteConversation,
  } = UseAuth();

  const {onlineUsers} = UseSocketContext()

  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchUser] = useState([]);
  const [addUID, setAddUID] = useState("");

  const isOnline=(id)=>{
    if(onlineUsers.includes(id))
      return true
    return false
  }

  const handelSearch = (searchText) => {
    if (sideUser.length != 0)
      setSearchUser(
        sideUser.filter((user) => {
          if ((user.username.toLowerCase()).includes(searchText.toLowerCase())) return 1;
          return 0;
        })
      );
  };

  const onUserAddHandlerChange = (e) => {
    setAddUserName(e.target.value);
  };

  const handleUserAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/auth/api/sideuseradd/${addUID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setAddUserName("");
    } catch (error) {
      console.log("adding user error");
    }
  };
  useEffect(() => {
    if (currentUser) userSideData();
  }, [addUID, clicked]);

  return (
    <>
      <div className="chatcontact p-3 ">
        <div className="chatcontact-content">
          <div className="chatcontactnav d-flex align-items-center justify-content-between mt-3">
            <input
              className="ps-2"
              onChange={(e) => {
                setSearchText(e.target.value);
                handelSearch(e.target.value);
              }}
              type="text"
              placeholder="Search"
            />
            <i
              className="fa-solid fa-plus fa-lg"
              data-bs-toggle="modal"
              data-bs-target="#AddUserModel"
              style={{ color: "#ffffff", cursor: "pointer" }}
            ></i>
          </div>
          <div className=" mt-4 usercontactbox pt-3 ps-2 d-flex flex-column gap-3 overflow-visible">
            {searchText.length > 0 ? (
              searchedUser.length > 0 ? (
                searchedUser.map((user) => {
                  return (
                    <div
                      className="sideUser d-flex justify-content-between align-items-center"
                      onClick={() => sideClicked(user._id)}
                      style={{
                        backgroundColor:
                          clicked == user._id ? "#D0E8C5" : "rgb(106 157 232)",
                        cursor: "pointer",
                      }}
                      key={user._id}
                    >
                      <div className="userconatct d-flex align-items-center gap-4 ps-3">
                        <div
                          className="profile position-relative"
                          style={{
                            backgroundImage:
                              "URL('https://images.unsplash.com/photo-1606335192038-f5a05f761b3a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                            backgroundSize: "contain",
                          }}
                        >
                          <div className={`${isOnline(user._id)?"isOnlineTag":"isOfflineTag"}`}></div>
                        </div>
                        
                        <p className="m-0 fw-2">{(user.username).toUpperCase()}</p>
                      </div>

                      <div className="me-4 position-relative">
                        <i
                          className="fa-regular fa-trash-can"
                          style={{color: "#991515"}}
                          onClick={() => deleteConversation(user._id)}
                        ></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No chat found</div>
              )
            ) : sideUser.length > 0 ? (
              sideUser.map((user) => {
                return (
                  <div
                    className="sideUser d-flex justify-content-between align-items-center"
                    onClick={() => sideClicked(user._id)}
                    style={{
                      backgroundColor:
                        clicked == user._id ? "#D0E8C5" : "rgb(106 157 232)",
                      cursor: "pointer",
                      boxShadow:
                        clicked == user._id ? "0px 0px 3px white" : "",
                    }}
                    key={user._id}
                  >
                    <div className="userconatct d-flex align-items-center gap-4 ps-3">
                      <div
                        className="profile position-relative"
                        style={{
                          backgroundImage:
                            "url('https://images.unsplash.com/photo-1606335192038-f5a05f761b3a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                          backgroundSize: "contain",
                        }}
                      >
                        <div className={`${isOnline(user._id)?"isOnlineTag":"isOfflineTag"}`}></div>
                      </div>
                      <p className="m-0 fw-2">{(user.username).toUpperCase()}</p>
                    </div>

                    <div className="me-4 position-relative">
                      <i
                        className="fa-regular fa-trash-can"
                        style={{color: "#991515"}}
                        onClick={() => deleteConversation(user._id)}
                      ></i>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No chat Avalible</div>
            )}
          </div>
        </div>
      </div>

      {/* AddUSerModel */}
      <div
        className="modal fade AddUserModel"
        id="AddUserModel"
        tabIndex="-1"
        aria-labelledby="AddUserModel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit={handleUserAdd}
              className="modal-body AddUserModel-body"
            >
              <input
                type="text"
                name="username"
                onChange={onUserAddHandlerChange}
                value={addUID}
                placeholder="Enter User Id..."
              />
              <button type="submit" className="btn btn-danger btn-sm ps-3 pe-3">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatContact;
