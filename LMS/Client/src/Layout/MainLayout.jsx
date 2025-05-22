import Navber from '@/components/Navber'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {  
  return (
    <div>
        <Navber/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout