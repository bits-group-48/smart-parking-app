import React from 'react'
import { Navbar } from '@/components/nav'

export default function CustomerLayout({children}:{children:React.ReactNode}) {
  return (
    <>
    <Navbar/>
    <div className='min-h-screen'>
    {children}
    </div>
    </>
  )
}

