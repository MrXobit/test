import React from 'react'
import './Main.css'
import { useNavigate } from 'react-router-dom'
const Main = () => {
  const navigate = useNavigate()
  return (
<div className='Main-con'>
    <button className='btn-get-users' onClick={() => navigate('/ollUsers')}>All Users</button>
    <button className='btn-get-products' onClick={() => navigate("/ollProducts")}>All Products</button>
    <button className='btn-create-order' onClick={() => navigate("/add-new-order")}>Create New Order</button>
</div>

  )
}

export default Main
