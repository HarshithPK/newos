import React from "react";
import { Container } from "react-bootstrap";
import { 
  BrowserRouter as Router, 
  Switch, 
  Route } 
from "react-router-dom";

//Component Imports
import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import UpdateProfile from "../pages/UpdateProfile";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import MainPage from "../pages/MainPage";
import SearchAstroidById from "../pages/SearchAstroidById";
import SearchAstroidsByDates from "../pages/SearchAstroidsByDates";
import AddUsername from "../pages/AddUserame";
import Navbar from "../pages/Navbar";

function App() {
  return (
    <div className="App">
      <Container>
        <div className="">
          <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={MainPage} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/search-astroid-id/:astroidId" component={SearchAstroidById} />
              <PrivateRoute exact path="/search-astroid-dates/:startDate&:endDate" component={SearchAstroidsByDates} />;
              <PrivateRoute exact path="/update-profile" component={UpdateProfile} />
              <PrivateRoute exact path="/add-username" component={AddUsername} />
              <PrivateRoute exact path="/navbar" component={Navbar}/>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
          </Router>
        </div>
      </Container>  
    </div>
  );
}

export default App;