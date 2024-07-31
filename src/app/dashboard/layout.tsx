import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <h1 style={{"color":"green"}}>......This is the layout page starting</h1>
      {children}
      <h1 style={{"color":"green"}}>This is the layout page ending.....</h1>
    </div>
  )
}

export default layout
