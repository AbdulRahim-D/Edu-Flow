import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children,allowedRole}) {
    const {user,isAuthenticated}=useSelector(state=>state.auth)
    if(!isAuthenticated) return <Navigate to="/login" replace/>

    if(allowedRole && allowedRole!==user.role)
        return <Navigate to="/login" replace/>
    return children
}

export default ProtectedRoute
