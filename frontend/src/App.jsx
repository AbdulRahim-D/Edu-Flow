import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import LandPage from './pages/LandPage'
import ClassPage from './pages/ClassPage'

function App() {
  const router=createBrowserRouter([
      {
      path:"/",
      element:<LandPage/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
    element:<DashboardLayout/>,
    children:[
       {
    path:"/teacher_dashboard",
    element:<ProtectedRoute allowedRole={"Teacher"}><TeacherDashboard/> </ProtectedRoute>
    },
    {
    path:"/student_dashboard",
    element:<ProtectedRoute allowedRole={"Student"}><StudentDashboard/> </ProtectedRoute>
    },
    {
    path:"/classes",
    element:<ClassPage/>
    }

    ]
    }
  ])
  return <RouterProvider router={router}/>
}

export default App
