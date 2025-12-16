'use client'
import { useRef, useState, useEffect } from 'react';
import { useScroll, motion, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Magnetic from '../../common/Magnetic';

export default function Contact() {
    const [timeGmt, setTimeGmt] = useState('');
    const [isHoveredEmail, setIsHoveredEmail] = useState(false);
    const [isHoveredPhone, setIsHoveredPhone] = useState(false);
    const container = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            const options = {
                timeZone: 'Asia/Dubai',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            setTimeGmt(new Date().toLocaleTimeString('en-US', options));
        };
        updateTime();
        const timerId = setInterval(updateTime, 1000);
        return () => clearInterval(timerId);
    }, []);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-300, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const rotate = useTransform(scrollYProgress, [0, 1], [45, 0]);

    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    const socials = [
        { name: 'Instagram', href: '#' },
        { name: 'Dribbble', href: '#' },
        { name: 'LinkedIn', href: '#' },
        { name: 'GitHub', href: '#' },
    ];

    return (
        <motion.footer
            ref={container}
            style={{ y: smoothY }}
            className="contact-footer"
        >
            {/* Background Elements */}
            <div className="footer-bg">
                <motion.div
                    className="gradient-orb orb-1"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="gradient-orb orb-2"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Marquee */}
            <div className="marquee-wrapper">
                <motion.div
                    className="marquee-content"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="marquee-text">
                            Let's Create Something Amazing Together
                            <span className="marquee-dot">✦</span>
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="footer-container">
                {/* Main CTA Section */}
                <motion.div
                    className="cta-section"
                    style={{ scale: smoothScale, opacity }}
                >
                    <div className="cta-content">
                        <motion.div
                            className="avatar-wrapper"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="avatar-glow" />
                            <div className="avatar-image">
                                <Image
                                    fill
                                    alt="Pouya Sadeqpour"
                                    src="/images/avatar.png"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <motion.div
                                className="avatar-ring"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        <div className="cta-text">
                            <motion.span
                                className="cta-label"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Available for new projects
                            </motion.span>
                            <h2 className="cta-title">
                                <motion.span
                                    className="title-line"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Let's work
                                </motion.span>
                                <motion.span
                                    className="title-line title-outline"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    together
                                </motion.span>
                            </h2>
                        </div>

                        <motion.div
                            className="cta-arrow"
                            style={{ rotate }}
                            whileHover={{ scale: 1.2 }}
                        >
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Contact Buttons */}
                <div className="contact-buttons" id="contact">
                    <Magnetic>
                        <motion.a
                            href="mailto:info@pouyasadeqpour.com"
                            className="contact-btn"
                            onHoverStart={() => setIsHoveredEmail(true)}
                            onHoverEnd={() => setIsHoveredEmail(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="btn-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="btn-text">info@pouyasadeqpour.com</span>
                            <motion.span
                                className="btn-arrow"
                                animate={{ x: isHoveredEmail ? 5 : 0 }}
                            >
                                →
                            </motion.span>
                            <div className="btn-bg" />
                        </motion.a>
                    </Magnetic>

                    <Magnetic>
                        <motion.a
                            href="tel:+989305258424"
                            className="contact-btn"
                            onHoverStart={() => setIsHoveredPhone(true)}
                            onHoverEnd={() => setIsHoveredPhone(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="btn-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="btn-text">+98 930 525 8424</span>
                            <motion.span
                                className="btn-arrow"
                                animate={{ x: isHoveredPhone ? 5 : 0 }}
                            >
                                →
                            </motion.span>
                            <div className="btn-bg" />
                        </motion.a>
                    </Magnetic>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-info">
                        <div className="info-block">
                            <span className="info-label">Version</span>
                            <span className="info-value">2025 © Edition</span>
                        </div>
                        <div className="info-block">
                            <span className="info-label">Local Time</span>
                            <span className="info-value time-value">
                                <span className="time-dot" />
                                {timeGmt} GMT+4
                            </span>
                        </div>
                    </div>

                    <div className="footer-socials">
                        <span className="socials-label">Socials</span>
                        <div className="socials-list">
                            {socials.map((social, index) => (
                                <Magnetic key={social.name}>
                                    <motion.a
                                        href={social.href}
                                        className="social-link"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ color: '#ff6b35' }}
                                    >
                                        {social.name}
                                    </motion.a>
                                </Magnetic>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Big Footer Text */}
                <div className="footer-brand">
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 0.03, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        POUYA
                    </motion.span>
                </div>
            </div>

            <style jsx global>{`
                .contact-footer {
                    position: relative;
                    min-height: 100vh;
                    background: #0a0a0a;
                    overflow: hidden;
                    padding-top: 100px;
                }

                .footer-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.5;
                }

                .orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%);
                    top: -200px;
                    right: -200px;
                }

                .orb-2 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(255, 107, 53, 0.2) 0%, transparent 70%);
                    bottom: 0;
                    left: -100px;
                }

                /* Marquee */
                .marquee-wrapper {
                    overflow: hidden;
                    padding: 30px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    background: rgba(255, 107, 53, 0.03);
                }

                .marquee-content {
                    display: flex;
                    white-space: nowrap;
                }

                .marquee-text {
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    color: rgba(255, 255, 255, 0.4);
                    padding: 0 50px;
                }

                .marquee-dot {
                    color: #ff6b35;
                    margin-left: 50px;
                }

                /* Container */
                .footer-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 100px 60px;
                    position: relative;
                }

                /* CTA Section */
                .cta-section {
                    margin-bottom: 80px;
                }

                .cta-content {
                    display: flex;
                    align-items: center;
                    gap: 40px;
                    padding-bottom: 80px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                }

                .avatar-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                }

                .avatar-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 150%;
                    height: 150%;
                    background: radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%);
                    pointer-events: none;
                }

                .avatar-image {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid rgba(255, 107, 53, 0.5);
                }

                .avatar-ring {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    border: 2px dashed rgba(255, 107, 53, 0.3);
                    border-radius: 50%;
                }

                .cta-text {
                    flex: 1;
                }

                .cta-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: #ff6b35;
                    margin-bottom: 20px;
                    padding: 10px 20px;
                    background: rgba(255, 107, 53, 0.1);
                    border-radius: 30px;
                    border: 1px solid rgba(255, 107, 53, 0.2);
                }

                .cta-label::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: #ff6b35;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }

                .cta-title {
                    margin: 0;
                }

                .title-line {
                    display: block;
                    font-size: clamp(48px, 8vw, 100px);
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: -4px;
                    line-height: 1;
                }

                .title-outline {
                    color: #0a0a0a;
                    -webkit-text-stroke: 1.5px #ff6b35;
                      paint-order: stroke fill;
                }

                .cta-arrow {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid rgba(255, 107, 53, 0.3);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cta-arrow:hover {
                    background: rgba(255, 107, 53, 0.1);
                    border-color: #ff6b35;
                }

                /* Contact Buttons */
                .contact-buttons {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 100px;
                }

                .contact-btn {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 25px 40px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 60px;
                    color: #fff;
                    text-decoration: none;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }

                .contact-btn:hover {
                    border-color: rgba(255, 107, 53, 0.5);
                }

                .contact-btn:hover .btn-bg {
                    transform: translateX(0);
                }

                .btn-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, rgba(255, 107, 53, 0.1) 0%, transparent 100%);
                    transform: translateX(-100%);
                    transition: transform 0.4s ease;
                }

                .btn-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 107, 53, 0.1);
                    border-radius: 50%;
                    color: #ff6b35;
                    position: relative;
                    z-index: 1;
                }

                .btn-text {
                    font-size: 18px;
                    font-weight: 400;
                    position: relative;
                    z-index: 1;
                }

                .btn-arrow {
                    font-size: 20px;
                    color: #ff6b35;
                    position: relative;
                    z-index: 1;
                }

                /* Footer Bottom */
                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-top: 60px;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                }

                .footer-info {
                    display: flex;
                    gap: 60px;
                }

                .info-block {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .info-label {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255, 255, 255, 0.4);
                }

                .info-value {
                    font-size: 15px;
                    color: #fff;
                }

                .time-value {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: monospace;
                }

                .time-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .footer-socials {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .socials-label {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255, 255, 255, 0.4);
                }

                .socials-list {
                    display: flex;
                    gap: 30px;
                }

                .social-link {
                    font-size: 15px;
                    color: #fff;
                    text-decoration: none;
                    position: relative;
                    transition: color 0.3s ease;
                }

                .social-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: #ff6b35;
                    transition: width 0.3s ease;
                }

                .social-link:hover::after {
                    width: 100%;
                }

                /* Footer Brand */
                .footer-brand {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    pointer-events: none;
                    overflow: hidden;
                }

                .footer-brand span {
                    font-size: clamp(100px, 20vw, 300px);
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -10px;
                    line-height: 0.8;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .cta-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .cta-arrow {
                        position: relative;
                        top: auto;
                        right: auto;
                        transform: none;
                        margin-top: 30px;
                    }

                    .contact-buttons {
                        flex-direction: column;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        gap: 40px;
                    }
                }

                @media (max-width: 768px) {
                    .footer-container {
                        padding: 60px 20px;
                    }

                    .footer-info {
                        flex-direction: column;
                        gap: 30px;
                    }

                    .socials-list {
                        flex-wrap: wrap;
                        gap: 20px;
                    }

                    .contact-btn {
                        padding: 20px 25px;
                    }

                    .btn-text {
                        font-size: 14px;
                    }
                }
            `}</style>
        </motion.footer>
    );
}