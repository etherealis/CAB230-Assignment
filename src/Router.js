import React, { Component } from "react";
import {
      Route,
	    Routes,
      NavLink,
      HashRouter
    } from "react-router-dom";
import Main from "./Main";
import LoginPage from "./Login";
import VolcanoPage from "./Volcanoes";
import RegisterPage from "./Register";
 
export default class Router extends Component {
  render() {
    return (
          <HashRouter>
            <div>
              <ul className="header">
                <li><NavLink exact to="/">Home</NavLink></li>
                <li><NavLink exact to="/Volcanoes">Volcano List</NavLink></li>
                <li><NavLink exact to="/Register">Register</NavLink></li>
                <li><NavLink exact to="/Login">Login</NavLink></li>
              </ul>
              <div className="content">
                <Routes>
                  <Route exact path="/" element={<Main />}></Route>
                  <Route exact path="/Volcanoes" element={<VolcanoPage />}></Route>
                  <Route exact path="/Register" element={<RegisterPage />}></Route>
                  <Route exact path="/Login" element={<LoginPage />}></Route>
                </Routes>
              </div>
            </div>
          </HashRouter>
    );
  }
}