import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import goBack from '../../assets/back.png'
import './CreateOrder.css'
import axios from 'axios'

const CreateOrder = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [erorr, setError] = useState(null)
  const [formData, setFormData] = useState({
    userId: '',
    productId: '',
    quantity: ''
  })



  const handleCreate = async(e) => {
    setError(null)
    e.preventDefault()
    setLoading(true)
    try {
       const response = await axios.post('http://localhost:5000/orders', {
          userId: formData.userId,
          productId: formData.productId,
          quantity: formData.quantity
       })
       setFormData({
        userId: '',
        productId: '',
        quantity: ''
      })
      localStorage.removeItem("createOrderForm");
    } catch (e) {
      console.log(e.response.data)
      setError(e.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeState = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    localStorage.setItem("createOrderForm", JSON.stringify(updatedFormData));
  }

  useEffect(() => {
    const savedForm = localStorage.getItem("createOrderForm");
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  }, []);
  
  

  return (
    <div className='CreateOrder-con'>
      <img className='createCoffeNetwork-imgBack' onClick={() => navigate("/")} src={goBack} alt="back" />

      <h1 className='CreateOrder-title'>Create order</h1>
      <form onSubmit={handleCreate} className='CreateOrder-form'>
        <input
          name="userId"
          value={formData.userId}
          onChange={handleChangeState}
          className='CreateOrder-form-input'
          type="text"
          placeholder='User ID'
        />

        <input
          name="productId"
          value={formData.productId}
          onChange={handleChangeState}
          className='CreateOrder-form-input'
          type="text"
          placeholder='Product ID'
        />

        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleChangeState}
          className='CreateOrder-form-input'
          type="number"
          placeholder='Quantity'
        />

        {erorr && <p className='CreateOrder-mistake'>{erorr}</p>}

        <button disabled={loading} type="submit" className='CreateOrder-form-btn'>
          {loading ? 'Loading...' : 'Create order'}
        </button>
      </form>

      <h1 className='Meaningless-advice'>У разі оновлення сторінки дані, які ви ввели у форму, не зникнуть — вони збережуться в локальному сховищі. Тож можете спокійно переходити та копіювати потрібні ID</h1>

    </div>
  )
}

export default CreateOrder
