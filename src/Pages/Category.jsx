import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useNavigate } from 'react-router-dom';

const Category = ({provider}) => {
  const navigate=useNavigate();
const handleBookNow=((provider)=>{
navigate('/layout/bookslot', { state: { provider } });
})

  return (
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card raised>
              <CardMedia
                component="img"
                width="100%" // Set width to fill the entire area
                height="150"
                image={provider.providericon}
                alt={provider.providername}
                style={{ objectFit: 'fill', objectPosition: 'center' }} // Ensure the image covers the entire area
                />
              <CardContent>
                <Typography variant="h6">{provider.providername}</Typography>
                <Typography variant="body2" color="textSecondary">
                 Price Rs. {provider.gasAmount}
                </Typography>
                <Button variant="outlined" size='small' color="primary"  onClick={() => handleBookNow(provider)} startIcon={<LocalShippingOutlinedIcon />} fullWidth>
          Book Now
        </Button>
              </CardContent>
            </Card>
          </Grid>
    
  );
};

export default Category;
