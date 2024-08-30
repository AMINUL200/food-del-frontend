import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; // Add this import
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url, clearCart } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to 'Cash On Delivery'

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({
      ...data,
      [name]: value
    })
  }

  const onPaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    console.log('Order Data:', orderData); // Debugging

    try {
      if (paymentMethod === 'online') {
        // Handle online payment with PayPal
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
          const { approval_url } = response.data;
          window.location.replace(approval_url); // Redirect to PayPal
        } else {
          alert("Failed to get approval URL. Please try again.");
        }
      } else {
        // Handle cash on delivery
        await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        clearCart();
        navigate('/myorders'); // Redirect to my orders
      }
    } catch (error) {
      console.error("Order Placement Error:", error); // Improved error handling
      alert("Failed to place order. Please try again.");
    }
  };

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <div className="cart-total-paymentoption">
            <p>Payment Method</p>
            <div>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="cod" 
                id="cod" 
                checked={paymentMethod === 'cod'}
                onChange={onPaymentMethodChange}
              />
              <label htmlFor="cod">Cash On Delivery</label>
            </div>
            <div>
              <input 
                type="radio"
                name="paymentMethod" 
                value="online" 
                id="op" 
                checked={paymentMethod === 'online'}
                onChange={onPaymentMethodChange}
              />
              <label htmlFor="op">Online Payment</label>
            </div>
          </div>
          <button type='submit'>PROCEED</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
