// Description/index.jsx
import styles from './style.module.scss';
import { useInView, motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Description() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "start 0.25"]
    });

    const words = "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.".split(" ");

    return (
        <section ref={container} className={styles.description} id="info">
            <div className={styles.body}>
                <p className={styles.paragraph}>
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        return (
                            <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                {word}
                            </Word>
                        );
                    })}
                </p>

                <div className={styles.bottom}>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                    >
                        The combination of my passion for design, code & interaction positions me in a unique place in the web design world.
                    </motion.p>

                    <MagneticButton />
                </div>
            </div>

            <motion.div
                className={styles.line}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
            />
        </section>
    );
}

// Word Component با افکت reveal بر اساس اسکرول
function Word({ children, progress, range }) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    const y = useTransform(progress, range, [10, 0]);

    return (
        <span className={styles.wordWrapper}>
            <motion.span style={{ opacity, y }} className={styles.word}>
                {children}
            </motion.span>
        </span>
    );
}

function MagneticButton() {
    const ref = useRef(null);

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.3;
        const y = (clientY - (top + height / 2)) * 0.3;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
        ref.current.style.transform = `translate(0px, 0px)`;
    };

    return (
        <motion.div
            ref={ref}
            className={styles.buttonWrapper}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
        >
            <motion.button
                className={styles.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className={styles.buttonText}>About me</span>
                <span className={styles.buttonIcon}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M1 9L9 1M9 1H2M9 1V8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                </span>
            </motion.button>
        </motion.div>
    );
}