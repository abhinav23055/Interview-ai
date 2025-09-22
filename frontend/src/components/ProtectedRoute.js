import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ sessionId, children }) => {
  if (!sessionId) {
    // If there is no sessionId, the user is not logged in.
    // Redirect them to the login page.
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, show the component they were trying to access.
  return children;
};

export default ProtectedRoute;