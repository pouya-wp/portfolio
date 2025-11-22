'use client';
import React, { useState, useEffect } from 'react';

export default function MobileBlocker({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  // برای جلوگیری از ارور Hydration در نکست جی‌اس، اولش چیزی نشون نمیدیم تا سایز معلوم شه
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // اگر عرض صفحه کمتر از 768 یا تاچ بود
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
      setIsChecking(false);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isChecking) return null; // یا یک لودینگ ساده

  if (isMobile) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        fontFamily: '"Clash Display Variable", sans-serif'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textTransform: 'uppercase' }}>
          Desktop Experience Only
        </h1>
        <p style={{ maxWidth: '300px', lineHeight: '1.6', color: '#888' }}>
          This portfolio features heavy 3D interactions and WebGL shaders designed for larger screens.
        </p>
        <div style={{
          marginTop: '40px',
          padding: '15px 30px',
          border: '1px solid #333',
          borderRadius: '50px',
          fontSize: '0.9rem'
        }}>
          Please visit via Desktop
        </div>
      </div>
    );
  }

  // اگر موبایل نبود، سایت اصلی رو نشون بده
  return <>{children}</>;
}