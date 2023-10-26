'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import Dashboard from './dashboard/page';
import AdminDashboard from './adminDashboard/page';
import LoginForm from './login/page';
import Vector from './vector/page';

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Example: Get the user role from a JWT token stored in localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // Decode the JWT token to access user information (assuming it contains a "role" claim)
      const decodedToken = jwtDecode(token);
      const userRoleFromToken = decodedToken.role || 'guest';

      // Set the user's role in the state
      setUserRole(userRoleFromToken);
    } else {
      // Handle the case where there is no token (user is not authenticated)
      setUserRole('guest'); // Set a default role for unauthenticated users
    }

    // Simulate loading for 2 seconds (you can replace this with actual data loading)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);


  return (
    <div>
      {/* Show loading spinner overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Render the appropriate dashboard based on user role when not loading */}
      {!isLoading && (
        userRole === 'admin' ? (
          <Vector />
        ) : userRole === 'sub-employee' ? (
          <Vector/>
        ) : (
          <LoginForm/> // Render a default dashboard component for other roles or unauthenticated users
        )
      )}
    </div>
  );
};

export default Home;


// 'use client'

// import React, { useEffect, useState } from 'react';
// import Dashboard from './dashboard/page';
// import jwtDecode from 'jwt-decode'; // Import a JWT decoding library
// import AdminDashboard from './adminDashboard/page';


// const Home = () => {
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     // Example: Get the user role from a JWT token stored in localStorage
//     const token = localStorage.getItem('authToken');

//     if (token) {
//       // Decode the JWT token to access user information (assuming it contains a "role" claim)
//       const decodedToken = jwtDecode(token);
//       const userRoleFromToken = decodedToken.role || 'guest';

//       // Set the user's role in the state
//       setUserRole(userRoleFromToken);
//     } else {
//       // Handle the case where there is no token (user is not authenticated)
//       setUserRole('guest'); // Set a default role for unauthenticated users
//     }
//   }, []);

//   return (
//     <div>
//       {/* Render the appropriate dashboard based on user role */}
//       {userRole === 'admin' ? (
//         <AdminDashboard />
//       ) : userRole === 'sub-employee' ? (
//         <Dashboard />
//       ) : (
//         null // <LoginForm /> // Render a default dashboard component for other roles or unauthenticated users
//       )}
//     </div>
//   );
// };

// export default Home;

