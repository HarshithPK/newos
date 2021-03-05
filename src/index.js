import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import AuthProvider from "./components/contexts/AuthContext";

import Navbar from './pages/Navbar';

//Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

//CSS 
import "./index.css";

ReactDOM.render(

	<AuthProvider>
		<Navbar/>
		<App />
	</AuthProvider>,
	document.getElementById('root')
);