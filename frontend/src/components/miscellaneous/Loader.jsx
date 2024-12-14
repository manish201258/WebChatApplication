import React from 'react'

const Loader = () => {
  return (
    <div className="spinner-border" role="status" style={{width:"1.6rem",height:"1.6rem"}}>
  <span className="visually-hidden">Loading...</span>
</div>
  )
}

export default Loader