import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { UseAuth } from '../Context/AuthContext';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseUrl from '../BaseUrl';

const UserLogin = () => {
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

  const handleSubmit = async(e) => {
    try {
      
      e.preventDefault();
      await axios.post(`${BaseUrl}/login`,formData)
      .then((res)=>{
        authenticate(res.data.token);
        if(res.status===201)
          toast("Login Success")
      })
    } catch (error) {
      console.log("client side error in login")
    }
    finally{}
  
  };

  return (
    <div className="login-container">
      <div className='formstart'>
      <h3 className='fw-bold  m-0'>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="enter email"
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
            placeholder="enter password"
            required
          />
        </div>
        <p className='m-0 mt-2'>New to the platform? 
  <NavLink to="/register" className="text-decoration-none ms-2 fw-semibold">
    Sign up here.
  </NavLink>
</p>
        <button type="submit" style={{backgroundColor:"rgb(112 122 137)"}}>Login</button>
      </form>
      </div>
     
    </div>
  )
}

export default UserLogin