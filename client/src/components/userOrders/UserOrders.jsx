import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import goBack from '../../assets/back.png'
import SubLoader from '../subLoader/SubLoader'
import axios from 'axios'
import './UsersOrders.css'

const UserOrders = () => {
    const {id} = useParams()
 const navigate = useNavigate()

const [loading, setLoading] = useState(false)
const [orders, setOrders] = useState([])
  const loadData = async() => {
    setLoading(true)
    try {
       const response = await axios.get(`http://localhost:5000/orders/${id}`)
       console.log(response.data)
       setOrders(response.data)
    } catch (e) {
        console.log(e.response.data.message)
    } finally {
        setLoading(false)
    }
  }

 
   useEffect(() => {
    loadData()
   }, [])


   if(loading) {
    return <SubLoader/>
  }


  return (
    <div className='UserOrders-con'>
     <img className='createCoffeNetwork-imgBack' onClick={() => navigate("/ollUsers")} src={goBack} alt="" />
       <h1 className='UserOrders-title'>User Orders</h1>


       {orders.length > 0 ? (
  <div className='UserOrders-cardsContainer'>
    {orders.map(order => (
      <div key={order._id} className='UserOrders-card'>
        <p className='UserOrders-card-item'><strong>Order ID:</strong> {order._id}</p>
        <p className='UserOrders-card-item'><strong>User ID:</strong> {order.userId}</p>
        <p className='UserOrders-card-item'><strong>Product ID:</strong> {order.productId}</p>
        <p className='UserOrders-card-item'><strong>Quantity:</strong> {order.quantity}</p>
        <p className='UserOrders-card-item'><strong>Total Price:</strong> {order.totalPrice.$numberDecimal}</p>
        <p className='UserOrders-card-item'><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    ))}
  </div>
) : (
  <div>
    <p className='UserOrders-noOrders'>No orders found</p>
  </div>
)}



    </div>
  )
}

export default UserOrders
