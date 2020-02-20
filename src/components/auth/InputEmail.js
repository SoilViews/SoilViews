  
import React from 'react'

const InputEmail = (props) => {
  return (
    <div className="input-field" >
      
      <input  type="email" placeholder='Email' id="email" onChange={props.handleChange} />
    </div>
  )
}
export default (InputEmail)