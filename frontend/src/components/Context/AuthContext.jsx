import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import BaseUrl from "../BaseUrl";
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sideUser, setsideUser] = useState([]);
  const [clicked, setClicked] = useState(null);
  const [chatPerson, setChatPerson] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const authenticate = async (token) => {
    Cookies.set('token', token, { expires: 30 });
    setIsAuthenticated(true);
    setLoading(true);
    try {
      await userData();
      await userSideData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
    if (token) {
      setLoading(true);
      Promise.all([userData(), userSideData()]).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setCurrentUser(null);
    setsideUser([]);
    setIsAuthenticated(false);
    toast.warn("Logout success");
  };

  const userData = async () => {
    const token = Cookies.get('token');
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/data`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const userSideData = async () => {
    try {
     await axios.get(`${BaseUrl}/sideuser`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      }).then((res)=>{
        setLoading(true)
        setsideUser(res.data);
      })
    } finally {
      setLoading(false);
    }
  };

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

  const deleteConversation = async (id) => {
    try {
      await axios.post(`${BaseUrl}/deleteconversation/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      })
      .then(()=>{
        setLoading(true)
        setClicked(null);
        userSideData();
      })
    } finally {
      setLoading(false);
    }
  };

  const blockConversation = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${BaseUrl}/blockuser/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setBlockedUsers((prevBlocked) => [...prevBlocked, id]);
    } finally {
      setLoading(false);
    }
  };

  const unblockConversation = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${BaseUrl}/unblockuser/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setBlockedUsers((prevBlocked) => prevBlocked.filter(userId => userId !== id));
    } finally {
      setLoading(false);
    }
  };

  const allBlockedData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/blockeddata`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      setBlockedUsers(res.data.blockedUsers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticate, isAuthenticated, currentUser, logout, sideUser, sideClicked, userSideData, clicked, chatPerson, deleteConversation, blockConversation, unblockConversation, allBlockedData, blockedUsers, setClicked, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
