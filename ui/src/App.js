import React, { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Home from './page/home/Home'
import Blog from './page/blog/Blog'
import Login from './page/login/Login'
import Register from './page/register/Register'
import BlogId from './page/blogId/BlogId'
import Postblog from './page/postblog/Postblog'
import Layout from './component/layout/Layout';
import userSession from './component/userSession';

import './App.css'
import Profile from './page/profile/Profile'
import OtpVerification from './page/otp/OtpVerification'


const App = () => {
  const [ member, setMember ] = useState(false)

  useEffect(() => {
    
    userSession().then(({sessionActive, member}) => {
      // Update member state based on session status
      setMember(sessionActive ? member : false);
    }).catch(error => {
      console.error("Error checking session:", error);
    });
  }, []);

  useEffect(() => {
    const getUser = () => {
      fetch('http://localhost:8000/auth/login/success', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error('Authentication failed!');
        })
        .then((resObject) => {
          setMember(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    getUser();
    
  }, []);

  const passedMember = (member) => {
    setMember(member);
  }
  console.log(member)
  
  const pages = createBrowserRouter(createRoutesFromElements(
    <Route element={<Layout member={ member }/>}>
      <Route index element={<Home member={ member }/>} />
      <Route path='/blog' element={ member._id ? <Blog member={ member }/> : <Login passedMember={passedMember} />} /> 
      <Route path='/blog/:id' element={ member._id ? <BlogId member={ member }/> : <Login passedMember={passedMember} /> } />
      <Route path='/newblog' element={<Postblog member={ member }/>} />
      <Route path='/login' element={<Login passedMember={passedMember}/>} />
      <Route path='/register' element={<Register />} />
      <Route path='/otpverification' element={<OtpVerification />} />
      <Route path={`/:username`} element={member.username ? < Profile member={ member }/> : <Login passedMember={passedMember} />}  />
    </Route>
  )) 

  return (
    <div className='app'>
      <RouterProvider router={pages} />
    </div>
  )
}

export default App