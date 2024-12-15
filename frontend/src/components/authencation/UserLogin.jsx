import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { UseAuth } from '../Context/AuthContext';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseUrl from '../BaseUrl';
import Loader from '../miscellaneous/Loader';

const UserLogin = () => {
  const {authenticate,loading,setLoading} = UseAuth()
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
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/login`,formData)
      .then((res)=>{
        authenticate(res.data.token);
        setLoading(true)
        if(res.status===201)
          toast("Login Success")
      })
    } catch (error) {
          if (error.response) {
            const status = error.response.status;
            if (status === 400) {
              toast.error("Provide all details!");
            } else if (status === 403) {
              toast.warn("Invalid Credentials!");
            } else if (status === 500) {
              toast.warn("Server issue");
            } else {
              toast.error("Unexpected error occurred");
            }
          } else {
            console.error("Client-side error in login:", error);
            toast.error("Login failed. Please try again.");
          }
        }
    finally{
      setLoading(false)
    }
  
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
{
  loading?
  (<button type="submit" style={{backgroundColor:"rgb(112 122 137)"}}><Loader/></button>)
  :
  (
    <button type="submit" style={{backgroundColor:"rgb(112 122 137)"}}>Login</button>
  )
}
      </form>
      </div>
     
    </div>
  )
}

export default UserLogin