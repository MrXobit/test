import React, { useEffect, useState } from 'react'
import SubLoader from '../subLoader/SubLoader'
import axios from 'axios';
import './OllUsers.css'
import goBack from '../../assets/back.png'
import { useNavigate } from 'react-router-dom';
const OllUsers = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadData()
 }, [])

  const loadData = async() => {
    setLoading(true)
    try {
      const response = await axios('http://localhost:5000/users')
      const usersData = response.data.map(user => {
        return {
          ...user,
          balance: user.balance ? user.balance.$numberDecimal : '0' 
        };
      });
      
      setUsers(usersData)
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
             oll users info
          </h1>

     

        {users.length > 0 ? (
     <div className='ollUsersCard-con'>
          {users.map(user => 
            <div key={user._id} className='OllUsers-card' onClick={() => navigate(`/user/${user._id}`)}>
                <p className='OllUsers-card-name'>{user.name}</p>
                <p className='OllUsers-card-email'>{user.email}</p>
                <p className='OllUsers-card-email'>{user.balance}</p>
                <p>id: {user._id}</p>
            </div>
          )}      
     </div>
        ) : (
            <div>
                <p className='OllUsers-noUsers'>No users</p>
            </div>
        )}

<h1 className='Meaningless-advice'>Натисніть на користувача, щоб переглянути його замовлення</h1>

    </div>
  )
}

export default OllUsers
