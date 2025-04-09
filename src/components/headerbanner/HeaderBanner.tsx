import { useState, useEffect } from 'react';
import './HeaderBanner.css'

const HeaderBanner = () => {

    const [currentPhrase, setCurrentPhrase] = useState('');
    const currentIndex: number = 0;

    const phrases = ['Chat with DeLaw', 'Create Legal documents', 'Understand Cases & Statutes', 'Get Legal Advice']
    const displayType = 'random';
    const interval = 5000;

  useEffect(() => {
    if (displayType === 'random') {
      const displayRandomPhrase = () => {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        setCurrentPhrase(phrases[randomIndex]);
      };

      displayRandomPhrase();
      const timer = setInterval(displayRandomPhrase, interval);

      return () => clearInterval(timer); 
    } 
  }, [phrases, displayType, interval, currentIndex]); 

  return <div className='header-banner'>{currentPhrase}</div>;
}

export default HeaderBanner