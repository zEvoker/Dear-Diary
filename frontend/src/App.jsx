import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Page from './pages/Page';
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
// import { AuthContext } from './context/AuthContext';


function App() {
  // const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState("");

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
          <Route index element={<ProtectedRoute><Home user={user} setUser={setUser} /></ProtectedRoute>} />
          <Route path="diary/:id" element={<ProtectedRoute><Page user={user}/></ProtectedRoute>} />
          {/* <Route path="login" element={<Login />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App