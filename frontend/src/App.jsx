import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const router=createBrowserRouter([
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
    element:<ProtectedRoute><TeacherDashboard/> </ProtectedRoute>
    },
    {
    path:"/student_dashboard",
    element:<ProtectedRoute><StudentDashboard/> </ProtectedRoute>

    }
    ]


    }
  ])
  return <RouterProvider router={router}/>
}

export default App
