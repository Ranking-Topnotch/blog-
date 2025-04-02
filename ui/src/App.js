"use client"

import React, { useContext, useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Home from "./page/home/Home"
import Blog from "./page/blog/Blog"
import Login from "./page/login/Login"
import Register from "./page/register/Register"
import BlogId from "./page/blogId/BlogId"
import Postblog from "./page/postblog/Postblog"
import Layout from "./component/layout/Layout"
import "./App.css"
import Profile from "./page/profile/Profile"
import OtpVerification from "./page/otp/OtpVerification"
import Contact from "./page/contact/Contact"
import ForgotPassword from "./page/forgetPassword/ForgetPassword"
import { UserContext, UserProvider } from "./context/UserContext"
import { UseIsAuthenticated } from "./context/UseIsAuthenticated"
import ProtectedRoute from "./component/ProtectedRoute"
import ResetPassword from "./page/forgetPassword/ResetPassword"

const AppContent = () => {
  const { setMember } = useContext(UserContext)
  const { setIsAuthenticated } = useContext(UseIsAuthenticated)

  useEffect(() => {
    const getUser = () => {
      fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/login/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json()
          throw new Error("Authentication failed!")
        })
        .then((resObject) => {
          console.log("Auth response:", resObject)
          // Check if user exists in the response
          if (resObject.user) {
            setMember(resObject.user)
            setIsAuthenticated(true)
            console.log("User authenticated:", resObject.user)
          } else if (resObject.member) {
            // Fallback in case the response structure uses 'member' instead of 'user'
            setMember(resObject.member)
            setIsAuthenticated(true)
            console.log("Member authenticated:", resObject.member)
          }
        })
        .catch((err) => {
          console.log("Auth error:", err)
          setIsAuthenticated(false)
        })
    }

    getUser()
  }, [setMember, setIsAuthenticated]) // Add dependencies

  const pages = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} /> {/* Removed extra space */}
        <Route path="/contact" element={<Contact />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogId />} />
          <Route path="/newblog" element={<Postblog />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Route>,
    ),
  )

  return (
    <div className="app">
      <main className="main-content">
        <RouterProvider router={pages} />
      </main>
    </div>
  )
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  return (
    <UseIsAuthenticated.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </UseIsAuthenticated.Provider>
  )
}

export default App


// import React, { useContext, useEffect, useState } from 'react'
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
// import Home from './page/home/Home'
// import Blog from './page/blog/Blog'
// import Login from './page/login/Login'
// import Register from './page/register/Register'
// import BlogId from './page/blogId/BlogId'
// import Postblog from './page/postblog/Postblog'
// import Layout from './component/layout/Layout';
// import './App.css'
// import Profile from './page/profile/Profile'
// import OtpVerification from './page/otp/OtpVerification'
// import Contact from './page/contact/Contact'
// import ForgotPassword from './page/forgetPassword/ForgetPassword'
// import { UserContext, UserProvider } from './context/UserContext'
// import { UseIsAuthenticated } from './context/UseIsAuthenticated'
// import ProtectedRoute from './component/ProtectedRoute'
// import ResetPassword from './page/forgetPassword/ResetPassword'



// const App = () => {
//   const { member, setMember } = useContext(UserContext);
//   const [ isAuthenticated, setIsAuthenticated ] = useState(false);
   
//   useEffect(() => {
//     const getUser = () => {
//       fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/login/success`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Credentials': true,
//         },
//       })
//         .then((response) => {
//           if (response.status === 200) return response.json();
//           throw new Error('Authentication failed!');
//         })
//         .then((resObject) => {
//           console.log(resObject)
//           setMember(resObject.member);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     };
  
//     getUser();
    
//   }, []);

//   const pages = createBrowserRouter(createRoutesFromElements(
//     <Route element={<Layout/>}>
//       <Route index element={<Home />} />
//       <Route path='/register' element={<Register />} />
//       <Route path='/login' element={<Login />} />
//       <Route path='/otpverification' element={<OtpVerification />} />
//       <Route path='/forgetpassword' element={ <ForgotPassword /> } /> 
//       <Route path={`/resetpassword/:token `} element={ <ResetPassword /> } /> 
//       <Route path='/contact' element={<Contact />} />

//       <Route element={<ProtectedRoute />} >
//         <Route path='/blog' element={ <Blog /> } /> 
//         <Route path='/blog/:id' element={<BlogId/> } />
//         <Route path='/newblog' element={<Postblog />} />
//         <Route path={`/profile/:username`} element={< Profile />}  />
//       </Route>
//     </Route>
    
//   )) 

//   return (
//     <UseIsAuthenticated.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       <UserProvider>
//         <div className='app'>
//           <main className="main-content">
//             <RouterProvider router={pages} />
//           </main>
//         </div>
//       </UserProvider>
//   </UseIsAuthenticated.Provider>  
//   )
// }

// export default App
