import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>

    </div>
  )
}

export default DashboardLayout