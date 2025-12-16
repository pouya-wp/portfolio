'use client'
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { motion } from 'framer-motion';
import styles from './style.module.scss';
import DepthBackground from '@/components/Depth/Depth';

const slideUp = {
  initial: { y: "100%" },
  enter: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  }
};

export default function Hero() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  let direction = -1;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: e => direction = e.direction * -1
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (xPercent < -100) xPercent = 0;
    else if (xPercent > 0) xPercent = -100;
    gsap.set(firstText.current, { xPercent });
    gsap.set(secondText.current, { xPercent });
    requestAnimationFrame(animate);
    xPercent += 0.1 * direction;
  };

  return (
    <motion.main variants={slideUp} initial="initial" animate="enter" className={styles.hero}>
      <DepthBackground />

      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            <span>Freelance</span>
            <svg className={styles.outlineSvg} viewBox="0 0 400 80">
              <defs>
                <mask id="textMask">
                  <rect width="100%" height="100%" fill="white"/>
                  <text x="0" y="60" fill="black">Developer</text>
                </mask>
              </defs>
              <text x="0" y="60" stroke="#fff" strokeWidth="2" fill="none" mask="url(#textMask)">Developer</text>
            </svg>
          </h1>
        </div>

        <div className={styles.right}>
          <p className={styles.bio}>
            Crafting digital experiences through
            clean code and creative design.
          </p>

          <div className={styles.cta}>
            <span>See my work</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.marqueeWrapper}>
        <div ref={slider} className={styles.marquee}>
          <p ref={firstText}>Design & Development — Creative Solutions — </p>
          <p ref={secondText}>Design & Development — Creative Solutions — </p>
        </div>
      </div>
    </motion.main>
  );
}