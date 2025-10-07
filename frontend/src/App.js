import './styles/basics.css'
import React from 'react';
import JobPage from './pages/JobPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    /*<div className="container">
      <button className="btn" > button</button>
      <div className="inputcontainer">
        <input className="input" type="text" required placeholder=""/>
        <label className="inputName">input</label>
      </div>
    </div>*/
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/jobs'
              element={
                <ProtectedRoute>
                  <JobPage />
                </ProtectedRoute>
              } />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>


  );

  /*return(
    <>
    
    </>
  )
}
*/}
export default App;
