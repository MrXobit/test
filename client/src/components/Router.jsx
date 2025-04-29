import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './main/Main'
import OllUsers from './ollUsers/OllUsers'
import UserOrders from './userOrders/UserOrders'
import CreateOrder from './createOrder/CreateOrder'
import OllProducs from './ollProuducts/OllProducs'

const Router = () => {
  return (
    <div>
         <Routes>
    
                <Route path="/ollUsers" element={<OllUsers />} />
                <Route path="*" element={<Main/>} />
                <Route path="/add-new-order" element={<CreateOrder />} />
                <Route path="/ollProducts" element={<OllProducs/>} />
                <Route path="/user/:id" element={<UserOrders />} />
           
      
          </Routes>
    </div>
  )
}

export default Router
