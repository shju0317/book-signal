import React from 'react'
import Header from '../components/common/Header'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div>
      <Header/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default RootLayout