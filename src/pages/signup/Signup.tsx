import React, { useState } from 'react';
import './Signup.css';
import apiService from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';

interface SignupProps {
  windowSize: number;
}

const Signup: React.FC<SignupProps> = ({windowSize}) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate()

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (username && password && email) {
      const formData = {
        'username': username,
        'email': email,
        'password': password,
      };

      apiService
        .register(formData)
        .then((response) => {
          if (response) {
            console.log('Signup successful:', response);
            setPassword('')
            setUsername('')
            navigate('/login')
          } else {
            alert('Signup failed');
          }
        })
        .catch((error) => {
          console.error('Signup error:', error);
          alert('Signup failed. Please check your credentials.');
        });
    } else {
      alert('Please enter both username and password.');
    }
  };

  return (
    <div className='auth-container'>
      <div className={windowSize > 768 ?'auth-display-container' : 'auth-display-container-none'}></div>

      <div className='auth-form-container'>
        <h2>Get Started</h2>
        <form onSubmit={onSubmit} className='auth-form'>
          <input
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />        
          <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />        
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />        
         <div className='button-group'>
            <button className='button' type='submit'>Sign up</button>
            <Link className='button' to={'/login'}>
              Login
            </Link>
          </div>
        </form>
        <span className='signup-footer'>CaseSimpli AI. <span>A product of CaseSimpli Legal Research Team</span></span>
      </div>
    </div>
  );
};

export default Signup;