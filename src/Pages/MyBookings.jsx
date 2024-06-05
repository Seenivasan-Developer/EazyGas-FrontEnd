import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Container,
  AccordionActions,
  Button,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { API } from '../global';
import { useNavigate } from 'react-router-dom';
import { editableBooking } from '../Redux/bookingSlice';

const MyBookings = () => {
  const [bookings, setBookings] = useState(null);
  const [selectedBooking, setSelectedBooking]=useState(null);
  const [confirmationOpen,setConfirmationOpen]=useState(false);
  const [userDetails] = useSelector((state) => state.auth.userDetail);
  const userId = userDetails.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem('user_data'))
  // Define headers
  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token.token,
    // add other headers as needed
  };
  useEffect(() => {
    axios.get(`${API}/booking/getBookingByUserID`, {
      params: {
        userid: userId,
      },
      headers: headers
    }).then((res) => {
      setBookings(res.data);
    }).catch((error) => {
      console.log(error.response);
    });
  }, [userId]);

 /* const handleCancel = (booking) => {
    const bookingid = { bookingid: booking._id };
    axios.post(`${API}/booking/CancelBookingByID`, bookingid,
      { headers: headers }).then((res) => {
        setBookings(prevBookings =>
          prevBookings.map(b => b._id === booking._id ? { ...b, DeliveryStatus: 'Cancelled' } : b)
        );
      }).catch((error) => {
        console.log(error.response);
      });
  }*/
  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setConfirmationOpen(true);
  }

  const confirmCancel = () => {
    axios.post(`${API}/booking/CancelBookingByID`, { bookingid: selectedBooking._id }, { headers: headers })
      .then((res) => {
        setBookings(prevBookings =>
          prevBookings.map(b => b._id === selectedBooking._id ? { ...b, DeliveryStatus: 'Cancelled' } : b)
        );
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => {
        setConfirmationOpen(false);
      });
  }
  const handleEdit = (booking) => {
    dispatch(editableBooking(booking));
    navigate('/layout/editbooking');
  }

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  if (!bookings) {
    return (
      <div className='RegisterContainer'>
        <CircularProgress />
        <Typography variant="h6">Loading booking history</Typography>
      </div>
    );
  } else if (bookings.length === 0) {
    return (
      <Typography variant="h6">No bookings found.</Typography>
    );
  } else {
    const deliveredBookings = bookings.filter(booking => booking.DeliveryStatus === 'Delivered');
    const pendingBookings = bookings.filter(booking => booking.DeliveryStatus === 'Pending');
    const cancelledBookings = bookings.filter(booking => booking.DeliveryStatus === 'Cancelled');

    const renderBookings = (bookingArray) => (
      bookingArray.map((booking) => (
        <Accordion key={booking._id} expanded={expanded === booking._id} onChange={handleChange(booking._id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '33%', flexShrink: 0 }}>{booking.providerdetails.providername}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Booking Date: {new Date(booking.BookingDate).toLocaleDateString()}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                  <Typography>Order Reference No</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{booking._id}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>Slot Time & Type</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{`${booking.selectedSlot} (${booking.selectedSlotType} Slot)`}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 10px 0 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>Mobile No/LPG No</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{booking.BPNo}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Address</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{`${booking.address[0]}, ${booking.address[1]}, ${booking.address[2]}, ${booking.address[3]}`}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>Gas Amount</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{`Rs. ${booking.gasAmount}`}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>Payment Type</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{booking.paymentMode}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 10px 0 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>Delivery Status</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{booking.DeliveryStatus}</Typography>
                  <Divider variant="middle" sx={{ margin: '16px 10px 0 0', backgroundColor: 'rgb(11 11 11)' }} />
                </Grid>
              </Grid>
            </Paper>
          </AccordionDetails>
          {booking.DeliveryStatus === 'Pending' ?
            <AccordionActions>
              <Button onClick={() => handleCancel(booking)}>Cancel</Button>
              <Button onClick={() => handleEdit(booking)}>Edit</Button>
            </AccordionActions> : ''}
        </Accordion>
      ))
    );

    return (
      <Container>
        <Typography variant="h4" gutterBottom>My Bookings</Typography>
        <Typography variant="h5" gutterBottom>Upcoming</Typography>
        {renderBookings(pendingBookings)}
        {pendingBookings.length === 0 && <Typography>No Upcoming bookings.</Typography>}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" gutterBottom>Delivered</Typography>
        {renderBookings(deliveredBookings)}
        {deliveredBookings.length === 0 && <Typography>No delivered bookings.</Typography>}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" gutterBottom>Cancelled</Typography>
        {renderBookings(cancelledBookings)}
        {cancelledBookings.length === 0 && <Typography>No cancelled bookings.</Typography>}

        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to cancel this booking?</Typography>
          </DialogContent>
          <DialogActions>
          <Button onClick={confirmCancel} color="primary">Yes</Button>
           <Button onClick={() => setConfirmationOpen(false)} color='primary'>No</Button>
         </DialogActions>
        </Dialog>

      </Container>
    );
  }
};

export default MyBookings;
