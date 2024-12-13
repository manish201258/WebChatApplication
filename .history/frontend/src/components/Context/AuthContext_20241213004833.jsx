import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser,setCurrentUser] = useState(null)
  const [sideUser,setsideUser] = useState([])
  const [clicked,setClicked] = useState(null)
  const [chatPerson,setChatPerson] = useState([])
  const [blockedUsers,setBlockedUsers] = useState();

  const authenticate = (token) => {
    Cookies.set('token', token, { expires: 30 });
    setIsAuthenticated(true);
      userData();
      userSideData();
  };

  // Fetch user data and side user data if token exists
  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
    if (token) {
      userData();
      userSideData();
    }
  },[]);

  // Logout
  const logout = () => {
    Cookies.remove('token');
    setCurrentUser(null);
    setCurrentUser([])
    setIsAuthenticated(false);
  };
  
  // Currrent User Data

  
    const userData = async()=>{
      const token = Cookies.get('token');
      await axios.get("http://localhost:3000/auth/api/data",{
       headers:{
         Authorization: `Bearer ${token}`
       }
     })
     .then((res)=>{
       setCurrentUser(res.data.data); 
     })
     }


  // Side Baruser
    async function userSideData(){
       await axios.get("http://localhost:3000/auth/api/sideuser",{
         headers:{
           Authorization:`Bearer ${Cookies.get('token')}`
         }
       })
       .then((res)=>{
         setsideUser(res.data)
       })
     }

  // Side User Clicked
  const sideClicked = (id) => {
    if (clicked === id) {
      setClicked(null);
      setChatPerson([]); 
    } else {
      setClicked(id);
      const selectedChatPerson = sideUser.find((e) => e._id === id);
      setChatPerson(selectedChatPerson ? [selectedChatPerson] : []); 
    }
  };

  useEffect(()=>{
    sideClicked(null)
  },[])


// User Manage
const deleteConversation = async(id) => {
  await axios.post(`http://localhost:3000/auth/api/deleteconversation/${id}`,{},{
    headers:{
      Authorization:`Bearer ${Cookies.get('token')}`
    }
  })
  .then(()=>{
    setClicked(null)
  })
}
const blockConversation = async (id) => {
  try {
    await axios.post(`http://localhost:3000/auth/api/blockuser/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    });
    // Update the blocked users state
    setBlockedUsers((prevBlocked) => [...prevBlocked, id]);
  } catch (error) {
    console.error("Error blocking user", error);
  }
};

const unblockConversation = async (id) => {
  try {
    await axios.post(`http://localhost:3000/auth/api/unblockuser/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    });
    // Update the blocked users state
    setBlockedUsers((prevBlocked) => prevBlocked.filter(userId => userId !== id));
  } catch (error) {
    console.error("Error unblocking user", error);
  }
};


const allBlockedData = async() => {
  await axios.get("http://localhost:3000/auth/api/blockeddata",{
    headers:{
      Authorization:`Bearer ${Cookies.get('token')}`
    }
  })
  .then((res)=>{
    setBlockedUsers(res.data.blockedUsers)
  })
}

  return (
    <AuthContext.Provider value={{ authenticate , isAuthenticated, currentUser,logout,sideUser,sideClicked,userSideData,clicked,chatPerson,deleteConversation,blockConversation,unblockConversation,allBlockedData,blockedUsers,setClicked}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
