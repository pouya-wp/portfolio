import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnterScreen = ({ children }) => {
  const [entered, setEntered] = useState(false);
  const audioRef = useRef(null);

  const handleEnter = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0;
      audio.play().then(() => {
        // Fade In Audio logic
        let vol = 0;
        const interval = setInterval(() => {
          if (vol < 0.5) {
            vol += 0.05;
            audio.volume = vol;
          } else {
            clearInterval(interval);
          }
        }, 100);
      }).catch(err => console.log(err));
    }

    setEntered(true);
  };

  return (
    <>
      {/* موزیک مخفی */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=music-112904.mp3"
        loop
      />

      <AnimatePresence mode="wait">
        {!entered && (
          <motion.div
            // انیمیشن خروج (پرده بالا می‌رود)
            exit={{
              y: '-100%', // حرکت به سمت بالا
              borderBottomLeftRadius: '50%', // خم شدن لبه پایینی هنگام بالا رفتن
              borderBottomRightRadius: '50%',
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // افکت Easing خیلی نرم
            }}
            onClick={handleEnter}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 999, // بالاترین لایه
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            {/* کانتینر متن */}
            <motion.div
               // انیمیشن محو شدن متن قبل از بالا رفتن پرده
               exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
               style={{ textAlign: 'center' }}
            >
                <h2 style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#0f0f0f',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                }}>
                    Welcome to my Journey
                </h2>

                <p style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        background: '#ff6b00',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'pulse 1.5s infinite'
                    }}></span>
                    ( CLICK TO SOUND ON )
                </p>
            </motion.div>

            {/* استایل برای انیمیشن چشمک زن نقطه */}
            <style>{`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 107, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
              }
            `}</style>

          </motion.div>
        )}
      </AnimatePresence>

      {/* محتوای اصلی سایت (تایم لاین) که زیر پرده است */}
      {children}
    </>
  );
};

export default EnterScreen;