import React, { useState } from 'react';
import axios from 'axios';
import { UseAuth } from '../Context/AuthContext';
import {NavLink} from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseUrl from '../BaseUrl';

const UserRegister = () => {
  const {authenticate} = UseAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      await axios.post(`${BaseUrl}/register`, formData)
      .then((res)=>{
          if(res.status===201)
            toast("Re")
      }) 

  };

  return (
    <div className="register-container">
      <div className='formstart'>
      <h2 className='fw-bold'>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
        <p className='m-0 mt-2'>Have an account?
          <NavLink to="/login" className="text-decoration-none ms-2 fw-semibold">
          Click here to log in.
          </NavLink></p>
          <button type="submit" className="">Register</button>
      </form>
      </div>
      
    </div>
  );
};

export default UserRegister;
