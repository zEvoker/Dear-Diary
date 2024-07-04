import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Page from './pages/Page';
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext } from './context/AuthContext';


function App() {
  // const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    // if (!currentUser) {
    //   return <Navigate to="/login" />
    // }
    return children
  };

  return (
    <>
      <Routes>
        <Route path="/" >
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="diary/:id" element={<ProtectedRoute><Page /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App