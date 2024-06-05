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

const EditBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //useSelector((state) =>state.reducerName.SliceName)
  const [userDetails]=useSelector((state)=> state.auth.userDetail)
  const [bookingData]=useSelector((state)=> state.booking.editabledata)
  const [providerData]=useSelector((state)=> state.provider.providerdata)

  console.log(userDetails)
  console.log(bookingData)
  console.log(providerData)
  const [provider] = providerData.filter((data)=>data._id===bookingData.providerdetails.providerid);
console.log(provider)
  //const { bookingData } = location.state || {};


  if (!bookingData) {
    return <div>No Booking data available</div>;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
     const formData = {
       providerdetails: {providername: values.providername, providerid: values.providerid},
        BookingDate: values.BookingDate,
        address: [values.doorNo, values.area, values.city, values.pincode],
        selectedSlot: values.slotTime,
        selectedSlotType: values.slotType,
        BPNo: values.bpNo,
        remarks: "",
        userDetails: {username: userDetails.userName, userid: userDetails.id},
        gasAmount: provider.gasAmount,
        paymentMode: values.paymentMode,
        DeliverStatus: "Pending"
      };
      const token=JSON.parse(localStorage.getItem('user_data'))
      // Define headers
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token.token,
      // add other headers as needed
    };
const formDatawithID={formData:formData,bookingid:bookingData._id};
console.log(formDatawithID)
      // Make a POST request to your backend API endpoint
     const res = await axios.post(`${API}/booking/UpdateBookingByID`, formDatawithID, { headers: headers });

        message.success('Booking Created Successfully');
       navigate('/layout/mybookings');
    } catch (error) {
      // Handle any errors
      message.error('Error creating booking:', error);
    } finally {
      setSubmitting(false);
    }
  };


  const initialValues = {
    providername: bookingData.providerdetails.providername,
    providerid:bookingData.providerdetails.providerid,
    BookingDate: new Date(bookingData.BookingDate).toISOString().split('T')[0],
    slotType: bookingData.selectedSlotType,
    slotTime: bookingData.selectedSlot,
    bpNo: bookingData.BPNo,
    gasAmount:bookingData.gasAmount,
    doorNo: bookingData.address[0],
    area: bookingData.address[1],
    city: bookingData.address[2],
    pincode: bookingData.address[3],
    paymentMode: bookingData.paymentMode,
    DeliveryStatus:bookingData.DeliveryStatus,
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
          <Typography variant="h6" align="left" gutterBottom>Edit Booking</Typography>
          <Form>
            <Grid container spacing={2}>
             {/* Slot Section */}
             <Grid item xs={12}>
             <Divider textAlign='left'> <Typography variant="subtitle1" gutterBottom>Slot Details</Typography>
                </Divider>
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
                  {values.slotType === 'Preferred' ?
                    <FormHelperText sx={{color:'red'}}>An additional Rs {provider.ExtraCharges} will be charged at the time of delivery.</FormHelperText> : ''}
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
              {/* Address Section */}
              <Grid item xs={12}>
              <Divider textAlign='left'> <Typography variant="subtitle1" gutterBottom>Address Details</Typography>
                </Divider>
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
               <Divider textAlign='left'><Typography variant="subtitle1" gutterBottom>Payment Details</Typography>
               </Divider> 
              </Grid>
             <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="gasAmount"
                  as={TextField}
                  label="Gas Amount Rs."
                  fullWidth
                  value={`Rs. ${provider.gasAmount}`}
                  disabled
                />
              </Grid>
             <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="paymentMode"
                  as={TextField}
                  label="Payment Mode"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} textAlign={'right'}>
                {isSubmitting && <CircularProgress />}
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={isSubmitting}
                      style={{marginRight:'10px'}}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="warning"
                      disabled={isSubmitting}
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </Button>
              </Grid>

            </Grid>
          </Form>
        </Container>
      )}
    </Formik>
  );
};

export default EditBooking;
