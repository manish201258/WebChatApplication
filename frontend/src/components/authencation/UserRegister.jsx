import React, { useState } from 'react';
import axios from 'axios';
import { UseAuth } from '../Context/AuthContext';
import {NavLink} from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseUrl from '../BaseUrl';
import Loader from '../miscellaneous/Loader';

const UserRegister = () => {
  const {loading,setLoading} = UseAuth()
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
    try {
      await axios.post(`${BaseUrl}/register`, formData)
      .then((res)=>{
        setLoading(true);
        if (res.status === 201) {
          toast.success("Register Success");
        } else if (res.status === 400) {
          toast.error("Provide all details!");
        } else if (res.status === 403) {
          toast.warn("Credentials already exist!");
        } else if (res.status === 500) {
          toast.warn("Server issue");
        }
      })
  
      
    } catch (error) {
      console.log("Client-side error in register:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="register-container">
      <div className='formstart'>
      <h3 className='fw-bold'>Register</h3>
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

          {
            loading?
            (
              <button type="submit" style={{backgroundColor:"rgb(112 122 137)"}}><Loader/></button>
            )
            :
            (
              <button type="submit" style={{backgroundColor:"rgb(112 122 137)"}}>Register</button>
            )
          }
          
      </form>
      </div>
      
    </div>
  );
};

export default UserRegister;
