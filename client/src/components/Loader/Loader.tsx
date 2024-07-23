// src/Loader.tsx
import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from './loader.json';
import './Loader.css';

type Props = {};

const Loader: React.FC<Props> = () => {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationLoaded(true);
    }, 1); 

    return () => clearTimeout(timer);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {isAnimationLoaded ? (
        <div className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <Lottie options={defaultOptions} />
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default Loader;
