import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import Category from './Category';
import { Typography, TextField, Container, Grid } from '@mui/material';


function Home() {
  const providersData = [
    { name: 'Bharat Gas', description: 'Description 1', imageUrl: 'https://seeklogo.com/images/B/bharat-gas-logo-4CD8DBD21C-seeklogo.com.png' },
    { name: 'HP Gas', description: 'Description 2', imageUrl: 'https://i.pinimg.com/236x/cb/bf/3f/cbbf3f1308ba8026507e487305ae61eb.jpg' },
    { name: 'Indane Gas', description: 'Description 3', imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNW8OtJZjp-IRsmKJ18n4zWkyW4BD8IFqot7sdL=w1080-h608-p-no-v0' },
    { name: 'Gail India', description: 'Description 4', imageUrl: 'https://seeklogo.com/images/G/gail-logo-7F9B1BEDC6-seeklogo.com.png' },
  ];
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProviders = providersData.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Assuming the JWT is stored in localStorage after login
    const token = JSON.parse(localStorage.getItem('user_data')).token;
    //    console.log(token)
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Assuming the username is stored in the 'username' field of the JWT payload
        setUsername(decodedToken.userName);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  return (
    <div>
      {/* <MenuBar/> */}
      <h1>Welcome {username}</h1>
      <TextField
        label="Search Providers"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Gas Providers
        </Typography>
        <Grid container spacing={3}>
          {filteredProviders.map((provider, index) =>
            <Category key={index} provider={provider} />)}
        </Grid>
      </Container>
    </div>
  )
}

export default Home