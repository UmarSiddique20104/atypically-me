import React from 'react';
import logo from '../../public/assets/logo/animation.json';
import WelcomeLotti from './components/reuseables/WelcomeLotti';
import "./globals.css";

const Welcome = () => {
  console.log('welcomeRunning')
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <WelcomeLotti animationData={logo} />
    </div>
  );
};

export default Welcome;
