'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const AdvancedCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const textRef = useRef(null);
  const trailsRef = useRef([]);

  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorStyle, setCursorStyle] = useState('default');
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // چک کردن موبایل
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // اگه موبایله، هیچی رندر نکن
  useEffect(() => {
    if (isMobile) {
      document.body.style.cursor = 'auto';
    }
  }, [isMobile]);

  const initCursor = useCallback(() => {
    if (isMobile) return;

    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const trails = trailsRef.current;

    // Quick setters برای performance بهتر
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.5, ease: "power3.out" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.5, ease: "power3.out" });

    // Trail animations
    const trailSetters = trails.map((trail, i) => ({
      x: gsap.quickTo(trail, "x", { duration: 0.3 + i * 0.1, ease: "power2.out" }),
      y: gsap.quickTo(trail, "y", { duration: 0.3 + i * 0.1, ease: "power2.out" })
    }));

    const moveCursor = (e) => {
      if (!isVisible) setIsVisible(true);

      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);

      // حرکت trails
      trailSetters.forEach(setter => {
        setter.x(e.clientX);
        setter.y(e.clientY);
      });
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // تشخیص المان‌های مختلف
    const setupHoverElements = () => {
      // لینک‌ها و دکمه‌های معمولی
      document.querySelectorAll('a, button, .clickable').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('link');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
        });
      });

      // المان‌های با data-cursor
      document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle(el.dataset.cursor);
          if (el.dataset.cursorText) {
            setCursorText(el.dataset.cursorText);
          }
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
          setCursorText('');
        });
      });

      // المان‌های View
      document.querySelectorAll('[data-cursor-view]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('view');
          setCursorText('View');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
          setCursorText('');
        });
      });

      // المان‌های Drag
      document.querySelectorAll('[data-cursor-drag]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('drag');
          setCursorText('Drag');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
          setCursorText('');
        });
      });

      // المان‌های Play
      document.querySelectorAll('[data-cursor-play]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('play');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
        });
      });

      // عکس‌ها
      document.querySelectorAll('img, .image-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('zoom');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
        });
      });

      // Magnetic elements
      document.querySelectorAll('.magnetic, .magnetic-wrapper').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovered(true);
          setCursorStyle('magnetic');
        });
        el.addEventListener('mouseleave', () => {
          setIsHovered(false);
          setCursorStyle('default');
        });
      });
    };

    // تاخیر برای DOM
    setTimeout(setupHoverElements, 100);

    // MutationObserver برای المان‌های داینامیک
    const observer = new MutationObserver(() => {
      setupHoverElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      observer.disconnect();
    };
  }, [isMobile, isVisible]);

  useEffect(() => {
    const cleanup = initCursor();
    return cleanup;
  }, [initCursor]);

  // انیمیشن‌های مختلف بر اساس state
  useEffect(() => {
    if (isMobile) return;

    const follower = followerRef.current;
    const cursor = cursorRef.current;
    const text = textRef.current;

    if (isHovered) {
      switch (cursorStyle) {
        case 'link':
          gsap.to(follower, {
            scale: 2.5,
            opacity: 0.3,
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            borderColor: '#ff6b35',
            duration: 0.4,
            ease: 'power3.out'
          });
          gsap.to(cursor, { scale: 0.5, opacity: 0.5, duration: 0.3 });
          break;

        case 'view':
        case 'drag':
          gsap.to(follower, {
            scale: 4,
            opacity: 1,
            backgroundColor: '#ff6b35',
            borderColor: '#ff6b35',
            duration: 0.4,
            ease: 'power3.out'
          });
          gsap.to(cursor, { scale: 0, duration: 0.3 });
          gsap.to(text, { scale: 1, opacity: 1, duration: 0.3 });
          break;

        case 'play':
          gsap.to(follower, {
            scale: 3.5,
            opacity: 1,
            backgroundColor: '#ff6b35',
            borderColor: '#ff6b35',
            duration: 0.4,
            ease: 'power3.out'
          });
          gsap.to(cursor, { scale: 0, duration: 0.3 });
          break;

        case 'zoom':
          gsap.to(follower, {
            scale: 2,
            opacity: 0.5,
            borderColor: '#fff',
            duration: 0.4
          });
          gsap.to(cursor, { scale: 1.5, duration: 0.3 });
          break;

        case 'magnetic':
          gsap.to(follower, {
            scale: 3,
            opacity: 0.2,
            borderColor: '#ff6b35',
            duration: 0.4
          });
          gsap.to(cursor, { scale: 0, duration: 0.3 });
          break;

        default:
          gsap.to(follower, { scale: 2, opacity: 0.5, duration: 0.3 });
          gsap.to(cursor, { scale: 0.5, duration: 0.3 });
      }
    } else {
      gsap.to(follower, {
        scale: 1,
        opacity: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(text, { scale: 0.5, opacity: 0, duration: 0.2 });
    }
  }, [isHovered, cursorStyle, isMobile]);

  // انیمیشن visibility
  useEffect(() => {
    if (isMobile) return;

    gsap.to([cursorRef.current, followerRef.current], {
      opacity: isVisible ? 1 : 0,
      duration: 0.3
    });
  }, [isVisible, isMobile]);

  // اگه موبایله، هیچی رندر نکن
  if (isMobile) return null;

  return (
    <>
      {/* Trails */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          ref={el => trailsRef.current[i] = el}
          style={{
            position: 'fixed',
            top: -3 - i,
            left: -3 - i,
            width: 6 + i * 2,
            height: 6 + i * 2,
            backgroundColor: `rgba(255, 107, 53, ${0.3 - i * 0.1})`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 2147483644 - i,
            opacity: 0.5
          }}
        />
      ))}

      {/* Follower - دایره بزرگ */}
      <div
        ref={followerRef}
        style={{
          position: 'fixed',
          top: -25,
          left: -25,
          width: 50,
          height: 50,
          border: '1.5px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483646,
          mixBlendMode: 'difference',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* Text inside follower */}
        <span
          ref={textRef}
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: 0,
            transform: 'scale(0.5)',
            mixBlendMode: 'difference'
          }}
        >
          {cursorText}
        </span>

        {/* Play Icon */}
        {cursorStyle === 'play' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#fff"
            style={{ mixBlendMode: 'difference' }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>

      {/* Main Dot - نقطه کوچک */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: -5,
          left: -5,
          width: 10,
          height: 10,
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483647,
          mixBlendMode: 'difference'
        }}
      />

      {/* Global Styles */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }

        @media (max-width: 768px), (hover: none) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdvancedCursor;