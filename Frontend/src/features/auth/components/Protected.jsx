import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

import React from 'react'
import Loader from "./Loader";

const Protected = ({children}) => {

  const {loading, user} = useAuth();

  if (loading) {
    return (<><Loader text="Loading..." /></>)
  }

  if (!user) {
  return <Navigate to={'/login'}/>
  
  }
  return children
}

export default Protected