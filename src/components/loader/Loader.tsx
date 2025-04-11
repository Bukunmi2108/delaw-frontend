import React, { useState, useEffect, CSSProperties } from 'react';
import './Loader.css'; // Import the CSS file for styling
import ClipLoader from 'react-spinners/ClipLoader';

interface ClipLoaderProps {
  loading: boolean;
  size?: number; // Optional size of the loader in pixels (default: 40)
  color?: string; // Optional color of the loader (default: #007bff - a typical blue)
  ariaLabel?: string; // Optional aria-label for accessibility
}

const Loader: React.FC<ClipLoaderProps> = ({
  loading,
  size = 40,
  color = '#007bff',
  ariaLabel = 'loading'
}) => {
  const [isVisible, setIsVisible] = useState(loading);

  useEffect(() => {
    setIsVisible(loading);
  }, [loading]);

  if (!isVisible) {
    return null;
  }

  const loaderStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    border: `${size / 10}px solid ${color}`,
    borderBottomColor: 'transparent',
  };

  const override: CSSProperties = {
      display: "block",
      margin: "10px auto", // Adjust margin as needed
      borderColor: "lightgray",
  };
  return (
    <ClipLoader color="#36D7B7" loading={loading} cssOverride={override} size={size} />
  );
};

export default Loader;