import React, { useContext, useState, useEffect } from 'react';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Fetch data from backend here
  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      const orders = response.data.data;
  
      // Convert the date field to a Date object before sorting
      orders.forEach(order => {
        order.date = new Date(order.date);
      });
  
      // Sort by `date` field in descending order
      orders.sort((a, b) => b.date - a.date);
  
      setData(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>{order.items.map((item, index) => (
              index === order.items.length - 1
                ? item.name + " X " + item.quantity
                : item.name + " X " + item.quantity + ", "
            ))}</p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span><b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
