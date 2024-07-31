import React from 'react'
import Sidebar from './sidebar'
import Sidebar2 from './sidebar2'
const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex'>
      <Sidebar />
      <Sidebar2></Sidebar2>
      {children}
    </div>
  )
}

export default layout
