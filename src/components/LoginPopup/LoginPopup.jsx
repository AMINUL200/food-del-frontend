import React, {  useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

    const {url, setToken} = useContext(StoreContext)
    const [currState, setCurrentState] = useState("Login");
    const [data, setData] = useState({
        name:'',
        email:'',
        password:''
    })
    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData({
           ...data,
            [name]: value
        })
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if(currState === 'Login') {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }
    
        try {
            const response = await axios.post(newUrl, data);
            if(response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/register:", error);
            if (error.response) {
                console.error("Server response:", error.response.data);
                alert(error.response.data.message || "An error occurred during registration.");
            } else {
                alert("An error occurred during registration.");
            }
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                    <input type="email" name="email" onChange={onChangeHandler} value={data.email} id="" placeholder='Your Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "LogIn"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of us & privacy policy.</p>
                </div>
                {currState === "Login" 
                ? <p>Create a new account ? <span onClick={() =>setCurrentState("Sign Up")}>Click here</span></p> 
                : <p>Already have an account? <span onClick={() =>setCurrentState("Login")}>Login</span></p>}


            </form>
        </div>
    )
}

export default LoginPopup
