import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import MenuBar from './MenuBar';

function Home() {
    const [username, setUsername] = useState('');

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
    </div>
  )
}

export default Home