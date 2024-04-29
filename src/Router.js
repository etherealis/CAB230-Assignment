import React, { Component } from "react";
import {
      Route,
	    Routes,
      NavLink,
      HashRouter
    } from "react-router-dom";
import MainPage from "./Main";
import LoginPage from "./LoginRegister";
import VolcanoListPage from "./Volcanoes";

import { FireFilled, HomeFilled, LockFilled, SmileFilled } from '@ant-design/icons';
import { Menu } from 'antd';
 
export default class Router extends Component {

  constructor() {
    super();
    this.state = {page: "main"};
    this.handleOnClick.bind(this)
    this.createPages.bind(this)
  }

  handleOnClick = (e) => {
    this.setState({page: e.key})
  }
  
  createPages = () => {
    let logged_user = localStorage.getItem("user_email")
    let items = [{ 
        label: (<NavLink exact to="/">Home</NavLink>),
        key: 'main',
        icon: <HomeFilled />
      }, {
        label: (<NavLink exact to="/Volcanoes">Volcano List</NavLink>),
        key: 'volcanoes',
        icon: <FireFilled />
      }]
      if(!logged_user){
        items.push({
          label: (<NavLink exact to="/LoginRegister">Login / Register </NavLink>),
          key: 'login',
          icon: <LockFilled />
        })
      } else {
        items.push({
          label: (<NavLink exact to="/LoginRegister">Welcome, {logged_user.split("@")[0]}!</NavLink>),
          key: 'login',
          icon: <SmileFilled />
        })
      }

    return items
  }

  render() {
    return (
          <HashRouter>
            <div>
              <Menu theme="dark" 
                onClick={this.handleOnClick} 
                selectedKeys={[this.state.page]} 
                mode="horizontal"  
                items={this.createPages()}>
              </Menu>
              <div className="content">
                <Routes>
                  <Route exact path="/" element={<MainPage />}></Route>
                  <Route path="/Volcanoes" element={<VolcanoListPage />}></Route>
                  <Route path="/LoginRegister" element={<LoginPage />}></Route>
                </Routes>
              </div>
            </div>
          </HashRouter>
    )
  }
}