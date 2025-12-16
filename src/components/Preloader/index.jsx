'use client';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { opacity, slideUp } from './anim';

export default function Preloader({ finishLoading }) {
    const [progress, setProgress] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, [finishLoading]);

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                if (finishLoading) finishLoading();
            }, 800);
            return;
        }

        const increment = () => {
            setProgress(prev => {
                if (prev < 30) return prev + Math.random() * 8;
                if (prev < 70) return prev + Math.random() * 4;
                if (prev < 90) return prev + Math.random() * 2;
                return prev + 0.5;
            });
        };

        const timer = setTimeout(increment, 50);
        return () => clearTimeout(timer);
    }, [progress]);

    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

    const curve = {
        initial: {
            d: initialPath,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            d: targetPath,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
        }
    };

    return (
        <motion.div variants={slideUp} initial="initial" exit="exit" className={styles.introduction}>
            {dimension.width > 0 && (
                <>
                    <motion.div variants={opacity} initial="initial" animate="enter" className={styles.counter}>
                        <span className={styles.number}>{Math.min(Math.floor(progress), 100)}</span>
                        <span className={styles.percent}>%</span>
                    </motion.div>

                    <motion.div
                        className={styles.progressBar}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        transition={{ ease: "easeOut" }}
                    />

                    <svg>
                        <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
                    </svg>
                </>
            )}
        </motion.div>
    );
}