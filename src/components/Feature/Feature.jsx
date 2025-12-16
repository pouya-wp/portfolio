import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaReact, FaWordpress, FaFigma, FaPaintBrush, FaVideo, FaCube } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const xVal = clientX - (left + width / 2);
    const yVal = clientY - (top + height / 2);
    x.set(xVal * 0.35);
    y.set(yVal * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="magnetic-wrapper"
    >
      {children}
    </motion.div>
  );
};

const experiences = [
  {
    id: 1,
    role: "Frontend Developer",
    company: "Freelance",
    period: "2023 - Present",
    desc: "Building modern web applications with React & Next.js. Creating smooth animations and interactive user experiences.",
    icon: <FaReact />
  },
  {
    id: 2,
    role: "WordPress Developer",
    company: "Freelance",
    period: "2022 - 2023",
    desc: "Developed custom themes and plugins. Built e-commerce solutions with WooCommerce for various clients.",
    icon: <FaWordpress />
  },
  {
    id: 3,
    role: "CGI Artist",
    company: "Freelance",
    period: "2021 - 2022",
    desc: "Created 3D product visualizations and architectural renders using Blender and Cinema 4D.",
    icon: <FaCube />
  },
  {
    id: 4,
    role: "Video Editor",
    company: "Freelance",
    period: "2020 - 2021",
    desc: "Edited promotional videos, motion graphics, and social media content using Premiere Pro and After Effects.",
    icon: <FaVideo />
  },
  {
    id: 5,
    role: "Graphic Designer",
    company: "Freelance",
    period: "2019 - 2020",
    desc: "Designed brand identities, social media graphics, and marketing materials for startups and small businesses.",
    icon: <FaPaintBrush />
  },
  {
    id: 6,
    role: "UI/UX Designer",
    company: "Freelance",
    period: "2018 - 2019",
    desc: "Started the creative journey designing user interfaces and prototypes in Figma and Adobe XD.",
    icon: <FaFigma />
  }
];

const Feature = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const bgLineRef = useRef(null);

  useEffect(() => {
    let scroll;
    import("locomotive-scroll").then((locomotiveModule) => {
      scroll = new locomotiveModule.default({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        multiplier: 1,
        class: "is-revealed",
        tablet: { smooth: true },
        smartphone: { smooth: true }
      });
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.timeline-item');
      const timelineInner = containerRef.current.querySelector('.timeline-inner');
      const lastDot = containerRef.current.querySelector('.timeline-item:last-child .timeline-dot');

      const calculateHeight = () => {
        if (!lastDot || !timelineInner) return '100%';
        const innerRect = timelineInner.getBoundingClientRect();
        const dotRect = lastDot.getBoundingClientRect();
        const height = (dotRect.top - innerRect.top) + (dotRect.height / 2);
        return height;
      };

      const finalHeight = calculateHeight();

      if (bgLineRef.current) {
        gsap.set(bgLineRef.current, { height: finalHeight });
      }

      gsap.fromTo(lineRef.current,
        { height: 0 },
        {
          height: finalHeight,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }
      );

      items.forEach((item) => {
        gsap.fromTo(item.querySelectorAll('.animate-text'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        );

        gsap.fromTo(item.querySelector('.timeline-dot'),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div data-scroll-container className="main-container">

      <section className="hero-section" data-scroll-section>
        <h1 data-scroll data-scroll-speed="0.2">MY JOURNEY</h1>
        <p data-scroll data-scroll-speed="0.1">From design to development</p>
      </section>

      <section className="timeline-section" ref={containerRef} data-scroll-section>
        <div className="timeline-inner">
          <div ref={bgLineRef} className="line-bg"></div>
          <div ref={lineRef} className="line-progress"></div>

          <div className="items-wrapper">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`timeline-item ${index % 2 === 0 ? 'layout-left' : 'layout-right'}`}>

                <div className="col-side">
                  {index % 2 === 0 ? (
                    <div className="date-wrapper" data-scroll data-scroll-speed="0.1">
                      <span className="date-text">{exp.period}</span>
                    </div>
                  ) : (
                    <div className="content-wrap">
                      <h2 className="role-title animate-text">{exp.role}</h2>
                      <h3 className="company-name animate-text">{exp.company}</h3>
                      <p className="description animate-text">{exp.desc}</p>
                    </div>
                  )}
                </div>

                <div className="col-center">
                  <Magnetic>
                    <div className="timeline-dot">
                      <div className="icon-inner">{exp.icon}</div>
                    </div>
                  </Magnetic>
                </div>

                <div className="col-side">
                  {index % 2 !== 0 ? (
                    <div className="date-wrapper" data-scroll data-scroll-speed="0.1">
                      <span className="date-text">{exp.period}</span>
                    </div>
                  ) : (
                    <div className="content-wrap">
                      <h2 className="role-title animate-text">{exp.role}</h2>
                      <h3 className="company-name animate-text">{exp.company}</h3>
                      <p className="description animate-text">{exp.desc}</p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="footer-spacer" data-scroll-section>
        <h2 data-scroll data-scroll-speed="0.2">THE JOURNEY CONTINUES...</h2>
      </section>
    </div>
  );
};

export default Feature;