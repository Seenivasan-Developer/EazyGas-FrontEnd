import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  AccordionActions,
  Button,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { API } from '../global';
import { useNavigate } from 'react-router-dom';
import { editableBooking } from '../Redux/bookingSlice';

const MyBookings = () => {
  const [bookings, setBookings] = useState(null);
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

  const handleCancel = (booking) => {
    const bookingid = { bookingid: booking._id };
    axios.post(`${API}/booking/CancelBookingByID`, bookingid,
      { headers: headers }).then((res) => {
        setBookings(prevBookings =>
          prevBookings.map(b => b._id === booking._id ? { ...b, DeliveryStatus: 'Cancelled' } : b)
        );
      }).catch((error) => {
        console.log(error.response);
      });
  }

  const handleEdit = (booking) => {
    dispatch(editableBooking(booking));
    navigate('/layout/editbooking');
  }

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
        <Accordion key={booking._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '33%', flexShrink: 0 }}>{booking.providerdetails.providername}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Booking Date: {new Date(booking.BookingDate).toLocaleDateString()}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText primary="Slot Time & Type" secondary={`${booking.selectedSlot} (${booking.selectedSlotType} Slot)`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Mobile No/LPG No" secondary={booking.BPNo} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Address" secondary={`${booking.address[0]}, ${booking.address[1]}, ${booking.address[2]}, ${booking.address[3]}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Payment Type" secondary={booking.paymentMode} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Delivery Status" secondary={booking.DeliveryStatus} />
              </ListItem>
              {booking.remarks && (
                <ListItem>
                  <ListItemText primary="Remarks" secondary={booking.remarks} />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary="Order Reference No" secondary={booking._id} />
              </ListItem>
            </List>
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

      </Container>
    );
  }
};

export default MyBookings;
