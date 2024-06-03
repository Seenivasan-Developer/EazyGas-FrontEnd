import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';

const Layout = () => {
 
  return (
    <>
    <MenuBar />
    <Outlet />
  </>
  );
};

export default Layout;
