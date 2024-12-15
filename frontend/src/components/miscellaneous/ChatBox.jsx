import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { UseAuth } from '../Context/AuthContext';
import { UseSocketContext } from '../Context/SocketContext';
import BaseUrl from '../BaseUrl';
import Loader from './Loader';

const ChatBox = () => {
  const { chatPerson, clicked, currentUser, blockedUsers, setClicked, loading, setLoading } = UseAuth();
  const lastMessageRef = useRef(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sendingLoading, setSendingLoading] = useState(false); 
  const [fetchingLoading, setFetchingLoading] = useState(false);
  const notificationSound = useRef(null);
  const [shakeMessage, setShakeMessage] = useState(false);

  useEffect(() => {
    notificationSound.current = new Audio('https://sounddino.com/mp3/44/incoming-message-online-whatsapp.mp3');
  }, []);


  useEffect(() => {
    const { socket } = UseSocketContext();

    const handleNewMessage = (newMessage) => {
      if (newMessage.receiverId === currentUser._id || newMessage.senderId === currentUser._id) {
        setConversation((prevConversation) => [...prevConversation, newMessage]);

        setShakeMessage(true);
        if (notificationSound.current) {
          notificationSound.current.play();
        }
      }
    };

    if (socket) {
      socket.on('newMessage', handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [currentUser._id, chatPerson]);

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setSendingLoading(true);

    const newMessage = {
      senderId: currentUser._id,
      receiverId: chatPerson[0]._id,
      message: message,
      createdAt: new Date(),
    };

    setConversation((prevConversation) => [...prevConversation, newMessage]);

    try {
      const response = await axios.post(
        `${BaseUrl}/send/${chatPerson[0]._id}`,
        { message, createdAt: newMessage.createdAt },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (response.status === 201) {
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    } finally {
      setSendingLoading(false);
    }
  };

  // Fetch chat messages for the selected person
  useEffect(() => {
    if (chatPerson) {
      const getChatPerson = async () => {
        setFetchingLoading(true);

        try {
          const response = await axios.get(`${BaseUrl}/get/${chatPerson[0]._id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          });
          setConversation(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setFetchingLoading(false);
        }
      };
      getChatPerson();
    }
  }, [chatPerson, clicked]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [conversation]);

  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesFormatted} ${ampm}`;
  };

  // For mobile toggle chats
  const toggleChat = () => {
    setClicked(null);
  };

  return (
    <div className="chat-box position-relative">
      <div className="mainChats">
        {fetchingLoading ? (
          <div className="nullChatMessage">
            <Loader />
          </div>
        ) : Array.isArray(conversation) && conversation.length === 0 ? (
          <div className="nullChatMessage">
            <p>Start new Conversation</p>
          </div>
        ) : (
          Array.isArray(conversation) &&
          conversation.map((data, index) => (
            <div
              key={index}
              ref={index === conversation.length - 1 ? lastMessageRef : null}
              className={`${
                currentUser._id === data.senderId ? 'sendMessageStyle' : 'receivedMessageStyle'
              } messageText`}
            >
              <p>{data.message}</p>
              <span>{formatTime(data.createdAt)}</span>
            </div>
          ))
        )}
      </div>

      {blockedUsers.includes(chatPerson[0]._id) ? (
        <div className="d-flex justify-content-center">
          <p className="fw-bold">Unblock to send a new message</p>
        </div>
      ) : (
        <form
          className="sendMessage d-flex align-items-center gap-4"
          onSubmit={handleSubmitMessage}
        >
          <input
            type="text"
            value={message}
            onChange={onChangeHandler}
            placeholder="Don't hesitate"
            required
          />
          <button type="submit" className="border-0 bg-transparent">
            {sendingLoading ? (
              <Loader />
            ) : (
              <i
                className="fa-solid fa-lg fa-paper-plane"
                style={{ color: 'rgb(42 43 41)' }}
              ></i>
            )}
          </button>
        </form>
      )}
      <div className="toogleChats" onClick={toggleChat}>
        <i className="fa-solid fa-shuffle fa-lg" style={{ color: '#ffffff' }}></i>
      </div>
    </div>
  );
};

export default ChatBox;
