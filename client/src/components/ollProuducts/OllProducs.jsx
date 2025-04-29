import React, { useEffect, useState } from 'react'
import SubLoader from '../subLoader/SubLoader'
import axios from 'axios';
import './OllProducs.css'
import goBack from '../../assets/back.png'
import { useNavigate } from 'react-router-dom';
const OllProducs = () => {
    const navigate = useNavigate()
     const [loading, setLoading] = useState(false)
      const [products, setProducts] = useState([])
    
      useEffect(() => {
        loadData()
     }, [])
    
      const loadData = async() => {
        setLoading(true)
        try {
          const response = await axios('http://localhost:5000/products')
          
          setProducts(response.data)
          console.log(response.data)
        } catch(e) {
           console.log(e)
        } finally {
            setLoading(false)
        }
      }
    
      if(loading) {
        return <SubLoader/>
      }
    
  return (
    <div className='ollUsers-con'>
 <img className='createCoffeNetwork-imgBack' onClick={() => navigate("/")} src={goBack} alt="" />
    <h1 className="OllUsers-title">
       oll producs info
    </h1>

  {products.length > 0 ? (
<div className='ollUsersCard-con'>
{products.map(product => 
  <div key={product._id} className='OllUsers-card'>
      <p className='OllUsers-card-name'>{product.name}</p>
      <p className='OllUsers-card-email'>Price: {product.price.$numberDecimal}</p>
      <p className='OllUsers-card-email'>Stock: {product.stock}</p>
      <p>id: {product._id}</p>
  </div>
)}
    
</div>
  ) : (
      <div>
          <p className='OllUsers-noUsers'>No Products</p>
      </div>
  )}
</div>
  )
}

export default OllProducs
