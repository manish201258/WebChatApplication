import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UseAuth } from "../Context/AuthContext";
import axios from "axios";
import { UseSocketContext } from "../Context/SocketContext";
import BaseUrl from "../BaseUrl";
import { toast } from "react-toastify";
import Loader from "./Loader";

const ChatContact = () => {
  const {
    currentUser,
    sideUser,
    sideClicked,
    userSideData,
    clicked,
    deleteConversation,
    loading,setLoading
  } = UseAuth();

  const { onlineUsers } = UseSocketContext();

  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchUser] = useState([]);
  const [addUserUID, setAddUserUID] = useState("");

  // Check if a user is online
  const isOnline = (id) => onlineUsers.includes(id);

  // Handle search functionality
  const handleSearch = (searchText) => {
    if (sideUser.length > 0) {
      const filteredUsers = sideUser.filter((user) =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchUser(filteredUsers);
    }
  };

  // Update the UID input for adding a new user
  const onUserAddHandlerChange = (e) => {
    setAddUserUID(e.target.value);
  };

  // Add a new user by UID
  const handleUserAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/sideuseradd/${addUserUID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      ).then((res)=>{
        setLoading(true);
        if(res.status===201)
        toast(`New User Added ${addUserUID}`)
      })
      setAddUserUID("");
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message);
      if(error.response.status===400)
        toast.info("User Already added")
      if(error.response.status===404)
        toast.error("User Not Found")
      if(error.response.status===404)
        toast.warn("Server error")

    }
    finally{
      setLoading(false)
    }
    
  };

  // Fetch user data when component mounts or user data changes
  useEffect(() => {
    // sideUser();
     userSideData();
  }, [addUserUID,clicked]);

  return (
    <>
      <div className="chatcontact p-3">
        <div className="chatcontact-content">
          <div className="chatcontactnav d-flex align-items-center justify-content-between mt-3">
            <input
              className="ps-2"
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch(e.target.value);
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

          <div className="mt-4 usercontactbox pt-3 ps-2 d-flex flex-column gap-3 overflow-visible">
            {searchText.length > 0 ? (
              searchedUser.length > 0 ? (
                searchedUser.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    clicked={clicked}
                    sideClicked={sideClicked}
                    isOnline={isOnline(user._id)}
                    deleteConversation={deleteConversation}
                  />
                ))
              ) : (
                <div style={{textAlign:"center"}}>No chat found</div>
              )
            ) : sideUser.length <= 0 ? (
              <div style={{textAlign:"center"}}>No chat available</div>
            ) : (

                sideUser.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    clicked={clicked}
                    sideClicked={sideClicked}
                    isOnline={isOnline(user._id)}
                    deleteConversation={deleteConversation}
                  />
                ))
             
              
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <div
        className="modal fade AddUserModel"
        id="AddUserModel"
        tabIndex="-1"
        aria-labelledby="AddUserModel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleUserAdd} className="modal-body AddUserModel-body">
              <input
                type="text"
                name="addUserUID"
                onChange={onUserAddHandlerChange}
                value={addUserUID}
                placeholder="Enter User Id..."
              />
                {
                  loading?
                  (
                    <button type="submit" className="btn btn-danger btn-sm ps-3 pe-3">
                <Loader/>
              </button>
                  )
                  :
                  (
<button type="submit" className="btn btn-danger btn-sm ps-3 pe-3">
                Add
              </button>
                  )
                }
                  
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const UserCard = ({ user, clicked, sideClicked, isOnline, deleteConversation }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteConversation(user._id); 
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="sideUser d-flex justify-content-between align-items-center"
      onClick={() => sideClicked(user._id)}
      style={{
        backgroundColor: clicked === user._id ? "#D0E8C5" : "rgb(106 157 232)",
        cursor: "pointer",
        boxShadow: clicked === user._id ? "0px 0px 3px white" : "",
      }}
    >
      <div className="userconatct d-flex align-items-center gap-4 ps-3">
        <div
          className="profile position-relative"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/034/324/148/large_2x/front-view-of-an-animated-boy-standing-wearing-tshirt-character-design-free-photo.jpeg')",
            backgroundSize: "contain",
          }}
        >
          <div className={isOnline ? "isOnlineTag" : "isOfflineTag"}></div>
        </div>
        <p className="m-0 fw-2">{user.username.toUpperCase()}</p>
      </div>
      <div className="me-4 position-relative">
        {isDeleting ? ( 
          <Loader />
        ) : (
          <i
            className="fa-regular fa-trash-can"
            style={{ color: "#991515" }}
            onClick={handleDelete}
          ></i>
        )}
      </div>
    </div>
  );
};
export default ChatContact;
