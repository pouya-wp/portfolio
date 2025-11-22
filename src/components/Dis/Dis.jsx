'use client';
import { useEffect } from 'react';

const ScrollRGB = () => {

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let speed = 0;
    let rafId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // محاسبه سرعت (تفاوت اسکرول الان با قبلی)
      const delta = currentScrollY - lastScrollY;

      // سرعت رو نرم‌تر میکنیم
      speed = delta * 0.5; // ضریب شدت افکت (با این عدد بازی کن)

      lastScrollY = currentScrollY;
    };

    const animate = () => {
      // کم کردن سرعت به مرور (Inertia) تا برگرده به صفر
      speed *= 0.9;

      // اگر سرعت خیلی کم بود، صفرش کن که پرفورمنس هدر نره
      if (Math.abs(speed) < 0.05) {
        speed = 0;
        document.body.style.textShadow = 'none';
        // برای عکس‌ها (سنگینه، اگر لگ زد خط پایین رو پاک کن)
        document.body.style.filter = 'none';
      } else {
        // محدود کردن ماکسیمم جابجایی (مثلا 10 پیکسل)
        const shift = Math.min(Math.max(speed, -10), 10);

        // اعمال افکت RGB روی متن‌ها
        // رنگ قرمز میره راست، آبی میره چپ
        document.body.style.textShadow = `${shift}px 0 0 rgba(255,0,0,0.4), ${-shift}px 0 0 rgba(0,0,255,0.4)`;

        // اعمال افکت روی عکس‌ها و بقیه چیزها (اختیاری - ممکنه سنگین باشه)
       // document.body.style.filter = `drop-shadow(${shift}px 0 0 rgba(255,0,0,0.2)) drop-shadow(${-shift}px 0 0 rgba(0,0,255,0.2))`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll);
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      document.body.style.textShadow = 'none';
      document.body.style.filter = 'none';
    };
  }, []);

  // این کامپوننت چیزی رندر نمیکنه، فقط افکت میده
  return null;
};

export default ScrollRGB;