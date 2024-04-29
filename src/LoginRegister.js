import React, { useState,  useEffect } from "react";
import { Button } from 'antd'

const API_URL = process.env.REACT_APP_API_URL

export default function LoginPage () {
    const [isRegister, setIsRegister] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const token = localStorage.getItem("token")
    useEffect(() => {

        if(token){setIsLoggedIn(true)}

        return () => {}
    }, [])

    const handleLoginClick = async () => {
        const URL = `${API_URL}/user/login`;
        const error_display = document.getElementById("error_msg")

        const email = document.getElementById("email_input").value
        const pass = document.getElementById("password_input").value
        if(!email || !pass) { 
            error_display.innerText = "Email or Password cannot be empty" 
            return 
        }

        const requestOptions = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: pass})
        }

        fetch(URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                if(data.error) { return alert(data.error.message) }
                localStorage.setItem("token", data.token)
                localStorage.setItem("expiry", data.expires_in)
                localStorage.setItem("user_email", email)
                setIsLoggedIn(true)
                alert("Login Success!")
            })
            .catch((e) => console.error(e))
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("expiry")
        localStorage.removeItem("user_email")
        setIsRegister(false)
        setIsLoggedIn(false)
        alert("Successful logout. Goodbye!")
    }

    const handleRegisterClick = () => {
        const URL = `${API_URL}/user/register`;
        const error_display = document.getElementById("reg_error_msg")

        const email = document.getElementById("reg_email_input").value
        const pass = document.getElementById("reg_password_input").value
        if(!email || !pass) { 
            error_display.innerText = "Email or Password cannot be empty" 
            return 
        }

        const requestOptions = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: pass})
        }

        fetch(URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                if(data.error) { return alert(data.error.message) }
                setIsLoggedIn(true)
                alert("Registration Success! Please Login")
            })
            .catch((e) => console.error(e))
    }

    return (
        <div>
            { !isLoggedIn?
                <section>            
                {!isRegister?
                    <span>
                        <h2>User Login</h2>
                        <h6 id="error_msg"/>
                        Email: &nbsp; <input id="email_input" type="text" defaultValue="" placeholder="johndoe@volcanoes.com" /><br/>
                        Password: &nbsp;  <input id="password_input" type="password" defaultValue="" /> <br/><br/>
                        <Button onClick={handleLoginClick}>Login</Button> <br/><br/>
                        No account? <Button onClick={() => setIsRegister(!isRegister)}>Sign Up</Button>
                    </span>
                    :
                    <span>
                        <h2>Registration</h2>
                        <RegisterComponent /><br/><br/>
                        <Button onClick={() => setIsRegister(!isRegister)}>Cancel</Button>
                        <Button onClick={handleRegisterClick}>Register</Button>
                    </span>       
                }
                </section>
                :
                <span>
                    <h2>Logged in as: {localStorage.getItem("user_email")}</h2>
                    <Button onClick={handleLogoutClick}>Logout</Button>
                </span>
            }
        </div>
    );
}

function RegisterComponent(){

    return(
        <div>
            <h6 id="reg_error_msg"/>
            Set Email: &nbsp; <input id="reg_email_input" type="text" defaultValue="" placeholder="johndoe@volcanoes.com" /><br/>
            Set Password: &nbsp;  <input id="reg_password_input" type="password" defaultValue="" /> <br/>
        </div>
    ) 
}
 