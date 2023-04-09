import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Play from './pages/Play';
import Opening from './pages/Opening';
import Nav from './components/Nav';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// use styled components
import styled from 'styled-components';
import PlayVsHuman from './pages/PlayVsHuman';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <StyledApp>
            <div className="Nav-bar">
              <Nav />
            </div>

            <div className="Content">
              <Routes>
                <Route path="/" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />
                <Route path="/watch" element={
                  <PrivateRoute>
                    <Watch />
                  </PrivateRoute>
                } />
                <Route path="/play" element={
                  <PrivateRoute>
                    <Play />
                  </PrivateRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/play-vs-human" element={
                  <PrivateRoute>
                    <PlayVsHuman />
                  </PrivateRoute>
                } />
                <Route path="/opening" element={
                  <PrivateRoute>
                    <Opening />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </StyledApp>
        </AuthProvider>
      </Router>

    </div>
  );
}

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  height: 98vh;
  width: 100%;

  // Nav-bar is 1/10 of the screen height, the remaining 9/10 is for Content
  .Nav-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 8vh;
    width: 100%;
    background-color: blue;
  }

  .Content {
    height: 90vh;
    width: 100%;
  }
`;

export default App;
