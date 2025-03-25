// src/pages/Home.jsx
import { Navigate, useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };
  const handleLoginClick=()=>{
    navigate('/login');
  }
  return (
    <div><button onClick={handleSignupClick}>Signup</button>
    <button onClick={handleLoginClick}>Login</button></div>
  )
}

export default Landing