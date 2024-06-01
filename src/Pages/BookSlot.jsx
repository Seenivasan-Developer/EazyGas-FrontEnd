import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { TextField } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';

// Define validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  address: Yup.string().required('Delivery address is required'),
  slotDate: Yup.date().required('Slot date is required'),
  slotTime: Yup.string().required('Slot time is required'),
});

// Slot time options
const slotTimes = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const BookingSlot = () => {
  return (
    <Container maxWidth="ld">
      <Typography variant="h4" align="center" gutterBottom>
        Book a Slot
      </Typography>
      <Formik
        initialValues={{ name: '', mobile: '', address: '', slotDate: '', slotTime: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            console.log('Form Data:', values);
            setSubmitting(false);
            resetForm();
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  component={TextField}
                  name="mobile"
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  type="tel"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="address"
                  label="Delivery Address"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  component={TextField}
                  name="slotDate"
                  label="Slot Date"
                  fullWidth
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  component={TextField}
                  name="slotTime"
                  label="Slot Time"
                  select
                  fullWidth
                  variant="outlined"
                >
                  {slotTimes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Slot'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default BookingSlot;
