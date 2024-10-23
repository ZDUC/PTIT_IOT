import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataSensor from './pages/DataSensor';
import Device from './pages/DetailDevice';
import Profile from './pages/Profile';

function App() {
  return (
   <>
   <Header/>
   <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/data-sensor' element={<DataSensor/>}/>
      <Route path='/device' element={<Device/>}/>
      <Route path='/profile' element={<Profile/>}/>
   </Routes>
   </>
  );
}

export default App;
