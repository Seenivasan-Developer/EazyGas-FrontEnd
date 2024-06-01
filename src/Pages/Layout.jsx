import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';// Import your MenuBar component

const Layout = () => {
 
  return (
    <>
    <MenuBar />
    <Outlet />
  </>
  );
};

export default Layout;
