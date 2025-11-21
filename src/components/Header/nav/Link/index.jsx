import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

export default function Index({data, isActive, setSelectedIndicator}) {

    const { title, href, index} = data;

    const handleScroll = (e) => {
        e.preventDefault();

        if (href && href.startsWith('#')) {
            const targetElement = document.querySelector(href);

            if (targetElement) {
              targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    return (
        <motion.div
            className={styles.link}
            onMouseEnter={() => {setSelectedIndicator(href)}}
            custom={index}
            variants={slide}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <motion.div
                variants={scale}
                animate={isActive ? "open" : "closed"}
                className={styles.indicator}>
            </motion.div>

            <motion.a
                href={href}
                onClick={handleScroll}
            >
                {title}
            </motion.a>
        </motion.div>
    )
}