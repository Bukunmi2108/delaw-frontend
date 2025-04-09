import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import apiService from '../../api/api';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const onSubmit = () => {
    if (username && password) {
      const formData = {
        'username': username,
        'password': password,
      }

      apiService
        .login(formData) // Send FormData
        .then((response) => {
          if (response && response.access_token) {
            console.log('Login successful:', response);
            // Handle successful login (e.g., redirect, update state)
          } else {
            alert('Login failed');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
        })
        .finally(() => {
          onClose(); // Close the modal after login attempt
        });

    } else {
      alert('Please enter both username and password.');
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="login-portal-overlay">
      <div ref={modalRef} className="login-portal-modal">
        <h2 className="login-portal-heading">Login</h2>
        <div className="login-portal-input-group">
          <label className="login-portal-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-portal-input"
          />
        </div>
        <div className="login-portal-input-group">
          <label className="login-portal-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-portal-input"
          />
        </div>
        <div className="login-portal-button-group">
          <button onClick={onSubmit} className="login-portal-button login-portal-submit-button">
            Login
          </button>
          <button onClick={onClose} className="login-portal-button login-portal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Login;