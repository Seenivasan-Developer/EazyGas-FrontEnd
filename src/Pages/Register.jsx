import { Button, Card, LinearProgress, Paper, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordField from './PasswordField';
import axios from 'axios';
import { API } from '../global';
import { message } from 'antd';


export default function Register() {
    const navigate = useNavigate();
    return (
        <Formik
            initialValues={{
                name: '',
                mobileNo: '',
                password: '',
                confirmpassword: ''
            }}
            validate={(values) => {
                const errors = {};
                if (!values.name) {
                    errors.name = 'Required';
                }
                if (!values.mobileNo) {
                    errors.mobileNo = 'Required';
                } else if (!/^\d{10}$/.test(values.mobileNo)) {
                    errors.mobileNo = 'Invalid mobile number';
                }
                if (!values.password) {
                    errors.password = 'Required';
                }
                if (!values.confirmpassword) {
                    errors.confirmpassword = 'Required';
                } else if (values.password !== values.confirmpassword) {
                    errors.confirmpassword = 'Passwords do not match';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
             //   setTimeout(() => {
                    setSubmitting(true);
                    // alert(JSON.stringify(values, null, 2));
                    axios.post(`${API}/users/register`, values)
                        .then((res) => {
                            console.log(res);
                            message.success("Registration Successful")
                            setSubmitting(false);
                            navigate("/login");
                        }).catch((err) => {
                            message.error(err.response?.data?.message || 'Something Went Wrong... Try Again');
                            setSubmitting(false);
                        })
               // }, 500);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <div className='RegisterContainer'>
                    <Paper elevation={24}>
                        <Card style={{ width: '380px', padding: '20px' }}>
                            <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
                                Register
                            </Typography>
                            <Form className='RegisterForm'>
                                <Field
                                    component={TextField}
                                    variant="standard"
                                    name="name"
                                    type="text"
                                    label="Name"
                                    fullWidth
                                />
                                <Field
                                    component={TextField}
                                    variant="standard"
                                    name="mobileNo"
                                    type="number"
                                    label="Mobile No"
                                    fullWidth
                                />
                                <PasswordField
                                    label="Password"
                                    name="password"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                                <PasswordField
                                    label="Confirm Password"
                                    name="confirmpassword"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                                {isSubmitting && <LinearProgress />}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                    style={{ marginTop: '20px' }}
                                    fullWidth
                                >
                                    Submit
                                </Button>
                                <div style={{ textAlign: "center", width: "100%", paddingBottom: "20px" }}>
                                    <label>Have already an account?</label>{" "}
                                    <Link
                                    to={isSubmitting ? '#' : '/'}
                                    style={{ pointerEvents: isSubmitting ? 'none' : 'auto', color: isSubmitting ? 'grey' : 'blue' }}
                                    // onClick={(e) => {
                                    //     if (loading) e.preventDefault();
                                    // }}
                                >Login Here</Link>
                                </div>
                            </Form>
                        </Card>
                    </Paper>
                </div>
            )}
        </Formik>
    );
}
