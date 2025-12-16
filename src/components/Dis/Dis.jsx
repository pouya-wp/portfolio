'use client';
import { useEffect, useRef } from 'react';

const ScrollDistortion = () => {
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          targetSpeedRef.current = (currentScrollY - lastScrollY) * 0.15;
          lastScrollY = currentScrollY;
          ticking = false;
        });
      }
    };

    const animate = () => {
      // Smooth lerp برای نرم‌تر شدن
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;
      targetSpeedRef.current *= 0.95;

      if (Math.abs(speedRef.current) < 0.01) {
        speedRef.current = 0;
        document.documentElement.style.removeProperty('--scroll-speed');
        document.documentElement.style.removeProperty('--scroll-direction');
      } else {
        const speed = Math.min(Math.max(speedRef.current, -1), 1);
        document.documentElement.style.setProperty('--scroll-speed', Math.abs(speed).toString());
        document.documentElement.style.setProperty('--scroll-direction', speed > 0 ? '1' : '-1');
      }

      rafId = requestAnimationFrame(animate);
    };

    // Passive listener برای پرفورمنس بهتر
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty('--scroll-speed');
      document.documentElement.style.removeProperty('--scroll-direction');
    };
  }, []);

  return null;
};

export default ScrollDistortion;