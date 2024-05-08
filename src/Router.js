import React, { Component } from "react";
import {
      Route,
	    Routes,
      NavLink,
      HashRouter
    } from "react-router-dom";
import MainPage from "./Main";
import LoginPage from "./Login";
import VolcanoListPage from "./Volcanoes";

import image1 from "./assets/images/image1.png"
import image2 from "./assets/images/image2.png"
import image3 from "./assets/images/image3.png"

import { FireFilled, HomeFilled, 
  LockFilled, SmileFilled, VerticalLeftOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
 
export default class Router extends Component {

  constructor() {
    super();

    let isLoggedIn = 
    !localStorage.getItem("user_email") ? false : true

    this.state = {page: "main", 
      collapsed: true, currentImgIndex: 0, 
      images: [image1, image2, image3],
      isLoggedIn: isLoggedIn
    }

    this.handleOnClick.bind(this)
    this.createPages.bind(this)
    this.setBackground.bind(this)
    this.handleLogoutClick.bind(this)
    this.setIsLoggedIn.bind(this)
  }

  handleOnClick = (e) => {
    this.setState({page: e.key})
  }

  handleLogoutClick = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("expiry")
    localStorage.removeItem("user_email")
    this.setState({isLoggedIn: false})
    alert("Successful logout. Goodbye!")
  }

  setIsLoggedIn = () => this.setState({isLoggedIn: !this.state.isLoggedIn, page: "login"})
  
  createPages = () => {
    let items = [{ 
        label: (<NavLink exact to="/">Home</NavLink>),
        key: 'main',
        icon: <HomeFilled />
      }, {
        label: (<NavLink exact to="/Volcanoes">Volcano List</NavLink>),
        key: 'volcanoes',
        icon: <FireFilled />
      }]
      if(!this.state.isLoggedIn){
        items.push({
          label: (<NavLink exact to="/LoginRegister">Login / Register </NavLink>),
          key: 'login',
          icon: <LockFilled />
        })
      } else {
        const user = localStorage.getItem("user_email")
        items.push({
          label: (<NavLink exact to="/LoginRegister">Welcome, {user.split("@")[0]}!</NavLink>),
          key: 'login',
          icon: <SmileFilled />
        }, {
          label: "Logout",
          key: 'logout',
          icon: <VerticalLeftOutlined />
        })
      }

    return items
  }

  setBackground = (index) => this.setState({currentImgIndex: index})
  

  render() {
    return (
          <HashRouter>
              <div id="router-wrapper">
              <img alt="volcano image" src={`${this.state.images[this.state.currentImgIndex]}`} 
                style={{  
                  position: "absolute",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  opacity: 0.2}}
              />
                <div id="router-menu">
                  <Menu
                    theme="dark" 
                    onClick={this.handleOnClick} 
                    onSelect={({key}) => key == "logout"? this.handleLogoutClick() : null }
                    selectedKeys={[this.state.page]} 
                    mode="horizontal"  
                    items={this.createPages()}
                    >
                  </Menu>
                </div>
                <div id="router-div">
                  <Routes>
                    <Route exact path="/" element={<MainPage setBackground={this.setBackground} />}></Route>
                    <Route path="/Volcanoes" element={<VolcanoListPage setBackground={this.setBackground} />}></Route>
                    <Route path="/LoginRegister" element={<LoginPage isLoggedIn={this.state.isLoggedIn} setIsLoggedIn={this.setIsLoggedIn} setBackground={this.setBackground} />}></Route>
                  </Routes>
                </div>
            </div>
          </HashRouter>
    )
  }
}