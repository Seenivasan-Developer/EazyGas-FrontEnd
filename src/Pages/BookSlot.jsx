import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select, Grid, FormHelperText, Container, Typography, Divider, CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../global';
import { message } from 'antd';

// Get today's date in YYYY-MM-DD format

const validationSchema = Yup.object({
  providername: Yup.string().required('Required'),
  BookingDate: Yup.date().required('Required').min(new Date().toISOString().split('T')[0], "Booking date cannot be in the past"),
  slotType: Yup.string().required('Required'),
  slotTime: Yup.string().required('Required'),
  bpNo: Yup.string().required('Required'),
  doorNo: Yup.string().required('Required'),
  area: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  pincode: Yup.string().required('Required').matches(/^[0-9]{6}$/, 'Must be exactly 6 digits'),
  paymentMode: Yup.string().required('Required'),
});

const BookSlot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //useSelector((state) =>state.reducerName.SliceName)
  const [userDetails]=useSelector((state)=> state.auth.userDetail)
  console.log(userDetails)
  const token=JSON.parse(localStorage.getItem('user_data'))
      // Define headers
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token.token,
      // add other headers as needed
    };
    const { provider } = location.state || {};

  if (!provider) {
    return <div>No provider data available</div>;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
     const formData = {
        providerdetails: {providername: provider.providername, providerid: provider._id},
        BookingDate: values.BookingDate,
        address: [values.doorNo, values.area, values.city, values.pincode],
        selectedSlot: values.slotTime,
        selectedSlotType: values.slotType,
        BPNo: values.bpNo,
        remarks: "",
        userDetails: {username: userDetails.userName, userid: userDetails.id},
        gasAmount: values.slotType==='Preferred' ? provider.ExtraCharges+provider.gasAmount : provider.gasAmount,
        paymentMode: values.paymentMode,
        DeliverStatus: "Pending"
      };
console.log(userDetails);
console.log(formData)
      // Make a POST request to your backend API endpoint
     const res = await axios.post(`${API}/booking/newBooking`, formData,{headers:headers});

        message.success('Booking Created Successfully');
       navigate('/layout/home');
    } catch (error) {
      // Handle any errors
      message.error('Error creating booking:', error);
    } finally {
      setSubmitting(false);
    }
  };


  const initialValues = {
    providername: provider.providername,
    BookingDate: '',
    slotType: '', // Added slotType field
    slotTime: '', // Added slotTime field
    bpNo: '',
    gasAmount:0,
    doorNo: '',
    area: '',
    city: '',
    pincode: '',
    paymentMode: '',
  };

  // Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, handleChange, values, setFieldValue, isSubmitting, resetForm }) => (
        <Container style={{ marginTop: "20px" }}>
          <Typography variant="h6" align="left" gutterBottom>New Booking</Typography>
          <Form>
            <Grid container spacing={2}>
             {/* Slot Section */}
             <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Slot Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="providername"
                  as={TextField}
                  label="Provider Name"
                  fullWidth
                  value={values.providername}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="BookingDate"
                  as={TextField}
                  label="Booking Date"
                  type="date"
                  fullWidth
                  disabled={isSubmitting}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: today, // Set minimum date to today
                  }}
                  error={touched.BookingDate && Boolean(errors.BookingDate)}
                  helperText={touched.BookingDate && errors.BookingDate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={touched.slotType && Boolean(errors.slotType)}>
                  <InputLabel>Slot Type</InputLabel>
                  <Field
                    name="slotType"
                    as={Select}
                    value={values.slotType}
                    onChange={(e) => {
                      // Reset slotTime when slotType changes
                      setFieldValue('slotType', e.target.value);
                      setFieldValue('slotTime', '');
                    }}
                    label='Slot Type'
                    disabled={isSubmitting}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Preferred">Preferred</MenuItem>
                  </Field>
                  {touched.slotType && Boolean(errors.slotType) && (
                    <FormHelperText>{errors.slotType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={touched.slotTime && Boolean(errors.slotTime)}>
                  <InputLabel>{values.slotType} Slot Time</InputLabel>
                  <Field
                    name="slotTime"
                    as={Select}
                    value={values.slotTime}
                    onChange={handleChange}
                    label={`${values.slotType} Slot Time`}
                    disabled={isSubmitting}
                  >
                    {/* Use ternary operator to conditionally render slot times */}
                    {values.slotType === "Available" ?
                      provider.availableTimeSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      )) :
                      provider.PreferredTimeSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))
                    }
                  </Field>
                  {values.slotType==='Preferred' ?
                   <FormHelperText>Extra Rs {provider.ExtraCharges} applicable</FormHelperText>:''}
                  {touched.slotTime && Boolean(errors.slotTime) && (
                    <FormHelperText>{errors.slotTime}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="bpNo"
                  as={TextField}
                  label="Mobile No/LPG ID"
                  fullWidth
                  disabled={isSubmitting}
                  error={touched.bpNo && Boolean(errors.bpNo)}
                  helperText={touched.bpNo && errors.bpNo}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="gasAmount"
                  as={TextField}
                  label="Gas Amount Rs."
                  type="number"
                  fullWidth
                  value={values.slotType==='Preferred' ? provider.ExtraCharges+provider.gasAmount : provider.gasAmount}
                  disabled
                />
              </Grid>
              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Address Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="doorNo"
                  as={TextField}
                  label="Door No/Street Name"
                  fullWidth
                  disabled={isSubmitting}
                  error={touched.doorNo && Boolean(errors.doorNo)}
                  helperText={touched.doorNo && errors.doorNo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="area"
                  as={TextField}
                  label="Area"
                  fullWidth
                  disabled={isSubmitting}
                  error={touched.area && Boolean(errors.area)}
                  helperText={touched.area && errors.area}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="city"
                  as={TextField}
                  label="City"
                  fullWidth
                  disabled={isSubmitting}
                  error={touched.city && Boolean(errors.city)}
                  helperText={touched.city && errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="pincode"
                  as={TextField}
                  label="Pincode"
                  fullWidth
                  disabled={isSubmitting}
                  error={touched.pincode && Boolean(errors.pincode)}
                  helperText={touched.pincode && errors.pincode}
                />
              </Grid>
              {/* Payment Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Payment Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={touched.paymentMode && Boolean(errors.paymentMode)}>
                  <InputLabel>Payment Mode</InputLabel>
                  <Field
                    name="paymentMode"
                    as={Select}
                    value={values.paymentMode}
                    onChange={handleChange}
                    label="paymentMode"
                    disabled={isSubmitting}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Field>
                  {touched.paymentMode && Boolean(errors.paymentMode) && (
                    <FormHelperText>{errors.paymentMode}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {isSubmitting && <CircularProgress />}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Book Now
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={() => resetForm()}
                    >
                      Clear
                    </Button>
              </Grid>

            </Grid>
          </Form>
        </Container>
      )}
    </Formik>
  );
};

export default BookSlot;
