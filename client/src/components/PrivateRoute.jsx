import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Current requirement: guests can use all features.
  const isAllowed = !!user; // guest OR logged-in

  return isAllowed ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
