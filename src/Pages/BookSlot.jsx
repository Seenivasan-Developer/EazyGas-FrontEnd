import React from 'react'
import { Button, Card, LinearProgress, Paper, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { Link, useNavigate } from 'react-router-dom';


function BookSlot() {
    const navigate=useNavigate();
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
                setTimeout(() => {
                    setSubmitting(false);
                     alert(JSON.stringify(values, null, 2));
                    
                }, 500);
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
                                <Field
                                    component={TextField}
                                    variant="standard"
                                    name="mobileNo"
                                    type="number"
                                    label="Mobile No"
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
                               
                            </Form>
                        </Card>
                    </Paper>
                </div>
            )}
        </Formik>
    );
}

export default BookSlot