'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const AdvancedCursor = () => {
  const cursorRef = useRef(null); // نقطه کوچک
  const followerRef = useRef(null); // دایره بزرگ دنبال کننده

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // مخفی کردن موس پیش فرض ویندوز
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // تنظیمات حرکت سریع و نرم با GSAP
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

    // دنبال کننده با تاخیر بیشتر (حس نرم بودن)
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    // تشخیص هاور روی لینک ها و دکمه ها
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);

    // پیدا کردن تمام المان های قابل کلیک
    const links = document.querySelectorAll('a, button, .timeline-dot, .magnetic-wrapper');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []); // اجرا فقط یکبار در شروع

  // استایل هاور برای دایره بزرگ
  useEffect(() => {
    if (isHovered) {
      gsap.to(followerRef.current, { scale: 3, opacity: 0.5, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0, duration: 0.3 }); // نقطه وسط غیب میشه
    } else {
      gsap.to(followerRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    }
  }, [isHovered]);

  return (
    <>
      {/* دایره بزرگ (Follower) */}
      <div
        ref={followerRef}
        style={{
          position: 'fixed',
          top: -20, // تنظیم مرکز
          left: -20,
          width: 40,
          height: 40,
          border: '1px solid white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483647,
          mixBlendMode: 'difference', // رنگ معکوس روی زمینه
          transformOrigin: 'center center'
        }}
      />

      {/* نقطه کوچک (Main Dot) */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          backgroundColor: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483647,
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
};

export default AdvancedCursor;