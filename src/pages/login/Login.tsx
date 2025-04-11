import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';
import { Loader } from '../../components';

interface LoginProps {
  windowSize: number;
}

const Login: React.FC<LoginProps> = ({windowSize}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {login} = useAuth()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (username && password) {
      const formData = {
        'username': username,
        'password': password,
      };
        setIsLoading(true)
        await login(formData).then((response) => {
          console.log('response', response)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
          setIsLoading(false)
        });
    } else {
      alert('Please enter both username and password.');
      setIsLoading(false)
    }
  };

  return (
    <div className='auth-container'>
      {isLoading && <div className="loader-overlay"><Loader loading={isLoading} /></div>}

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