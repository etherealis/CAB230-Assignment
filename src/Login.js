import React, { useState,  useEffect } from "react";
import { Button, Form, Input } from 'antd'
import RegisterComponent from "./Register";

const API_URL = "http://4.237.58.241:3000"

export default function LoginPage ({setBackground, isLoggedIn, setIsLoggedIn}) {
    const [isRegister, setIsRegister] = useState(false)

    useEffect(() => {   
        setBackground(2)
    }, [])

    const handleLoginClick = async (formValues) => {
        const URL = `${API_URL}/user/login`;
        const error_display = document.getElementById("error_msg")

        const email = formValues.email
        const pass = formValues.password

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
                if(data.error) {
                    error_display.innerText = data.message 
                } else {
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("expiry", data.expires_in)
                    localStorage.setItem("user_email", email)
                    setIsLoggedIn(true)
                    alert("Login Success!")
                }
            }).catch((e) => console.error(e))
    }

    return (
        <div>
            { !isLoggedIn?
                <section>            
                {!isRegister?
                    <span>
                        <h2>User Login</h2>
                        <h4 id="error_msg"/>
                        <Form
                            className="form"
                            name="login"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                minWidth: 200,
                                maxWidth:300
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={values => handleLoginClick(values)}
                            autoComplete="off"
                            >
                            <Form.Item
                                label="Email"
                                name="email"
                                hasFeedback
                                rules={[{
                                        required: true,
                                        message: 'Required',
                                    }, {
                                        type: "email",
                                        message: "Invalid Email"
                                    }
                                ]}>
                            <Input /></Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                hasFeedback
                                rules={[{
                                    required: true,
                                    message: 'Required'
                                    },
                                ]}>
                            <Input.Password/></Form.Item>
                            <Button className="buttons" type="primary" htmlType="submit"> Login</Button><br/><br/>
                            <span>
                                No account? &nbsp;
                                <Button className="buttons" onClick={() => setIsRegister(true)}>Create an Account</Button>
                            </span>                        
                        </Form>
                    </span>
                    :
                    <span>
                        <h2>Registration</h2>
                        <RegisterComponent setIsRegister={setIsRegister} setIsLoggedIn={setIsLoggedIn}/><br/><br/>
                    </span>       
                }
                </section>
                :
                <span>
                    <h2>Logged in as: {localStorage.getItem("user_email")}</h2>
                </span>
            }
        </div>
    );
}