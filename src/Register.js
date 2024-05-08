import React, { useState, useEffect } from "react"
import { Button, Form, Input } from 'antd'

const API_URL = "http://4.237.58.241:3000"

export default function RegisterComponent({setIsRegister, setIsLoggedIn}){

    const handleRegisterClick = (formValues) => {
        const URL = `${API_URL}/user/register`;
        const error_display = document.getElementById("reg_error_msg")

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
                    localStorage.setItem("user_email", email)
                    setIsLoggedIn(true)
                    setIsRegister(false)
                    alert("Registration Success!")
                }
            })
            .catch((e) => error_display.innerText = e)
    }

    return(
        <div>
            <h4 id="reg_error_msg"/>
            <Form
                className="form"
                name="registration"
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
                onFinish={values => handleRegisterClick(values)}
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
                <Form.Item
                    label="Confirm"
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[{
                        required: true,
                        message: 'Required'
                        }, ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}>
                <Input.Password/></Form.Item><br/>
                <Button className="buttons" onClick={() => setIsRegister(false)}>Cancel</Button> &nbsp;
                <Button className="buttons" type="primary" htmlType="submit">
                    Register
                </Button>
            </Form>
        </div>
    ) 
}