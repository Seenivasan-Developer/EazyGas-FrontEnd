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

function App() { 
  //useSelector((state) =>state.reducerName.SliceName)

  const isAuthenticated = useSelector((state) => state.auth.userAuthCheck);
  //false; // Replace this with actual authentication check
console.log(isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/layout' element={<Layout />}>
          <Route path="home" element={ isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="bookslot" element={ isAuthenticated ? <BookSlot /> : <Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
