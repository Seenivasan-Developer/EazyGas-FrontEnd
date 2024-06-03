import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Card, message } from "antd";
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../global";
import { Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { authCheck, userData } from "../Redux/authSlice";
import { jwtDecode } from "jwt-decode";

const { Text } = Typography;

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values) => {
        // console.log(values);
        setLoading(true); //start Loading & disable Form
        try {
            const res = await axios.post(`${API}/users/login`, values)
            message.success("Login Successful")
            localStorage.setItem("user_data", JSON.stringify(res.data))
            dispatch(authCheck(true));

            const token = res.data.token;

            console.log(token)
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    dispatch(userData(decodedToken));
                    navigate("/layout/home");
                    // console.log(decodedToken)
                } catch (error) {
                    console.error('Invalid token', error);
                    message.error("Something went Wrong, please try again...")
                }
            }
            else {
                message.error("Something went Wrong, please try again...")
            }

        } catch (error) {
            if (error.response) {
                message.error("Invalid Credentials");
            } else if (error.request) {
                message.error("Network error, please try again");
            } else {
                message.error("Something went wrong, please try again");
            }
            dispatch(authCheck(false));
            form.resetFields(); // Reset the form fields
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <div className="LoginContainer">
            <Paper elevation={24}>
                <Card bordered={false}
                    style={{

                        width: 380,
                    }}
                >
                    <div><h4 style={{ textAlign: "center", color: "maroon", padding: '30px' }}>Welcome to EazyGAS</h4>
                        <h6>Login</h6>
                    </div>
                    <Form form={form} onFinish={onFinish} size="large">
                        <Form.Item
                            name="mobileNo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your mobile no!',
                                },
                                {
                                    pattern: /^\d{10}$/,
                                    message: 'Mobile number must be exactly 10 digits!',
                                },
                            ]}
                        >
                            <Input type="number" prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="mobile no" disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your Password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                disabled={loading}
                            />
                        </Form.Item>
                        {/* <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item> */}

                        <Form.Item>
                            <Button block="true" type="primary" htmlType="submit" className="login-form-button" loading={loading} disabled={loading}>
                                Log in
                            </Button>
                            <div disabled={loading} style={{ textAlign: "center", width: "100%" }}>
                                <Text disabled={loading}>Don't have an account?</Text>{" "}
                                <Link
                                    to={loading ? '#' : '/register'}
                                    style={{ pointerEvents: loading ? 'none' : 'auto', color: loading ? 'grey' : 'blue' }}
                                // onClick={(e) => {
                                //     if (loading) e.preventDefault();
                                // }}
                                >Register now</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Paper>
        </div>
    )
}

export default Login