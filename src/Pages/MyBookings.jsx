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
  console.log(userId);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  useEffect(() => {
    axios.get(`${API}/booking/getBookingByUserID`, {
      params: {
        userid: userId,
      }
    }).then((res) => {
      console.log(res.data);
      setBookings(res.data);
    }).catch((error) => {
      console.log(error.response);
    });
  }, [userId]);

  const handleCancel = (booking) => {
    const bookingid = { bookingid: booking._id };
    axios.post(`${API}/booking/CancelBookingByID`, bookingid).then((res) => {
      console.log(res.data);
      setBookings(prevBookings => prevBookings.filter(b => b._id !== booking._id));
    }).catch((error) => {
      console.log(error.response);
    });
  }

  const handleEdit=(booking)=>{
    console.log(booking)
    dispatch(editableBooking(booking))
navigate('/layout/editbooking');
  }
 // console.log(!bookings)
  if(!bookings){
    return(
<div className='RegisterContainer'>
        <CircularProgress />
        <Typography variant="h6">Loading booking history</Typography>
      </div>);
  }
  else if(bookings.length === 0){
    return(
     <Typography variant="h6">No bookings found.</Typography>);
   }
   else{
  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>
      {bookings.map((booking) => (
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
                  <ListItemText primary="Payment Mode" secondary={booking.paymentMode} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Delivery Status" secondary={booking.isDelivered ? "Delivered" : "Pending"} />
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
            <AccordionActions>
              <Button onClick={()=>handleCancel(booking)}>Cancel</Button>
              <Button onClick={()=>handleEdit(booking)}>Edit</Button>
            </AccordionActions>
          </Accordion>
        ))
      }
    </Container>
  );}
};

export default MyBookings;
