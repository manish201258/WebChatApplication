import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { UseAuth } from '../Context/AuthContext';
import { UseSocketContext } from '../Context/SocketContext';

const ChatBox = () => {
  const { chatPerson, clicked, currentUser, blockedUsers, setClicked } = UseAuth();
  const lastMessageRef = useRef(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const useListenerMessage = () => {
    const { socket } = UseSocketContext();

    useEffect(() => {
      const handleNewMessage = (newMessage) => {
        setConversation((prevConversation) => [...prevConversation, newMessage]);
      };

      if (socket) {
        socket.on("newMessage", handleNewMessage);
      }

      return () => {
        if (socket) {
          socket.off("newMessage", handleNewMessage);
        }
      };
    }, [socket]);
  };

  useListenerMessage();

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      senderId: currentUser._id,
      receiverId: chatPerson[0]._id,
      message: message,
    };

    setConversation((prevConversation) => [...prevConversation, newMessage]);

    try {
      await axios.post(
        `http://localhost:3000/auth/api/send/${chatPerson[0]._id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  // Fetch chat messages for the selected person
  useEffect(() => {
    if (chatPerson) {
      const getChatPerson = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/auth/api/get/${chatPerson[0]._id}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
            }
          );
          setConversation(res.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
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
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesFormatted} ${ampm}`;
  };
  

  // for mobile toogle chats
  const toogleChat = () => {
    setClicked(null);
  };

  return (
    <div className="chat-box position-relative">
      <div className="mainChats">
        {conversation && conversation.length > 0 ? (
          conversation.map((data, index) => (
            <div
              key={index}
              ref={index === conversation.length - 1 ? lastMessageRef : null}
              className={`${
                currentUser._id === data.senderId ? 'sendMessageStyle' : 'receivedMessageStyle'
              } messageText`}
            >
              <p style={{
                ::a
              }}>{data.message}</p>
              <span>{formatTime(data.createdAt)}</span>
            </div>
          ))
        ) : (
          <div className="nullChatMessage">
            <p>Start new Conversation</p>
          </div>
        )}
      </div>
      {blockedUsers.includes(chatPerson[0]._id) ? (
        <div>
          <p>Unblock to send a new message</p>
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
            className=""
            required
          />
          <button type="submit" className="border-0 bg-transparent">
            <i
              className="fa-solid fa-lg fa-paper-plane"
              style={{ color: 'rgb(42 43 41)' }}
            ></i>
          </button>
        </form>
      )}
      <div className="toogleChats" onClick={toogleChat}>
        <i className="fa-solid fa-shuffle fa-lg" style={{ color: '#ffffff' }}></i>
      </div>
    </div>
  );
};

export default ChatBox;
