import React from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import BookSlot from './Pages/BookSlot';
import Layout from './Pages/Layout';
import { useSelector } from 'react-redux';
import Profile from './Pages/Profile';
import MyBookings from './Pages/MyBookings';
import EditBooking from './Pages/EditBooking';

function App() { 
  //useSelector((state) =>state.reducerName.SliceName)

  const isAuthenticated = useSelector((state) => state.auth.userAuthCheck);
 //console.log(isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route path='/layout' element={ isAuthenticated ? <Layout /> : <Navigate to="/" replace />}>
          <Route path="home" element={ isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
          <Route path="bookslot" element={ isAuthenticated ? <BookSlot /> : <Navigate to="/" replace />} />
          <Route path="mybookings" element={ isAuthenticated ? <MyBookings /> : <Navigate to="/" replace />} />
          <Route path="editbooking" element={ isAuthenticated ? <EditBooking /> : <Navigate to="/" replace />} />
          <Route path="profile" element={ isAuthenticated ? <Profile /> : <Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
