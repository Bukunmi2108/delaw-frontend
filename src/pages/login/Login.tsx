import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';

interface LoginProps {
  windowSize: number;
}

const Login: React.FC<LoginProps> = ({windowSize}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {login} = useAuth()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (username && password) {
      const formData = {
        'username': username,
        'password': password,
      };

        await login(formData).then((response) => {
          console.log('response', response)
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
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
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />        
          <div className='button-group'>
            <button className='button' type='submit'>Log in</button>
            <Link className='button' to={'/register'}>
              Sign up
            </Link>
          </div>
        </form>
        <span className='login-footer'>CaseSimpli AI. <span>A product of CaseSimpli Legal Research Team</span></span>
      </div>
    </div>
  );
};

export default Login;