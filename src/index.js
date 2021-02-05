import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import AuthProvider from "./components/contexts/AuthContext";

//Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

//CSS 
import "./index.css";
import Navbar from './pages/Navbar';

ReactDOM.render(
  <AuthProvider>
    <Navbar/>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);