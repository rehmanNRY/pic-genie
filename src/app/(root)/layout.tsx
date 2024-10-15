import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='root-container'>
      <Sidebar/>
      <MobileNav/>
      <div className="wrapper">
      {children}
      </div>
    </div>
  )
}

export default Layout