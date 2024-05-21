import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Nav from '../nav/Nav'

const Layout = ({ member }) => {
  return (
    <>
        <Toaster />
        <Nav member={ member }/>
        <Outlet />
    </>
  )
}

export default Layout