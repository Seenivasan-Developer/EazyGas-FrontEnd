import React, { useEffect, useState } from 'react'
import Category from './Category';
import { Typography, TextField, Container, Grid, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { API } from '../global';
import { useDispatch, useSelector } from 'react-redux';
import { providerDetails } from '../Redux/providerSlice';


function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders]=useState([]);
  const dispatch=useDispatch();

  const [userDetails]=useSelector((state)=> state.auth.userDetail)
  console.log(userDetails)
  console.log(userDetails.userName)
  
  useEffect(() => {
    const token=JSON.parse(localStorage.getItem('user_data'))
  // Define headers
const headers = {
  'Content-Type': 'application/json',
  'x-auth-token': token.token,
  // add other headers as needed
};
      // Add any other headers you need
    axios.get(`${API}/providers/getAllProviders`,{headers}).then((res) => {
      console.log(res.data);
      setProviders(res.data);
      dispatch(providerDetails(res.data))
      
  }).catch ((error)=>{
    console.log(error)
  });
  }, [setProviders]);

 //handle the search provider
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProviders = providers.filter(provider =>
    provider.providername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    providers.length===0? (
      <div className='RegisterContainer'>
        <CircularProgress />
        <Typography variant="h6">Loading Providers</Typography>
      </div>
    ) : ( <div>
      {/* <MenuBar/> */}
      <Container>
       <Typography variant="h6" align="right">Welcome {userDetails.userName}</Typography>
       <Typography variant="h6" align="left">
          Book Your Slot
        </Typography>
      <TextField
        label="Search Providers"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        size='small'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
     
        <Grid container spacing={3}>
          {filteredProviders.map((provider, index) =>
            <Category key={index} provider={provider} />)}
        </Grid>
      </Container>
    </div>)
  )
}

export default Home