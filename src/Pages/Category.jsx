import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const Category = ({provider}) => {
  return (
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card raised>
              <CardMedia
                component="img"
                width="100%" // Set width to fill the entire area
                height="150"
                image={provider.imageUrl}
                alt={provider.name}
                style={{ objectFit: 'fill', objectPosition: 'center' }} // Ensure the image covers the entire area
                />
              <CardContent>
                <Typography variant="h6">{provider.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {provider.description}
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
          Book Now
        </Button>
              </CardContent>
            </Card>
          </Grid>
    
  );
};

export default Category;
