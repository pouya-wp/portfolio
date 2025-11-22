import React from 'react';

const NoiseOverlay = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // کلیک ازش رد میشه
        zIndex: 2147483647, // زیر لودینگ، روی محتوا
        opacity: 0.06, // نویز خیلی محو و شیک
        mixBlendMode: 'multiply', // ترکیب با پس زمینه
        backgroundImage: `url("/noise.gif")`, // لینک گیف خودت رو اینجا بذار
        backgroundRepeat: 'repeat',
      }}
    />
  );
};

export default NoiseOverlay;