import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaReact, FaNodeJs, FaFigma, FaCode } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// --- Magnetic Button Component ---
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
    role: "Senior Frontend Dev",
    company: "Tech Giant Co.",
    period: "2023 - Present",
    desc: "Leading the frontend team, implementing micro-frontend architecture, and improving site performance by 40%.",
    icon: <FaReact />
  },
  {
    id: 2,
    role: "UI/UX Designer",
    company: "Creative Agency",
    period: "2021 - 2023",
    desc: "Designed comprehensive design systems and high-fidelity interactive prototypes for fintech clients.",
    icon: <FaFigma />
  },
  {
    id: 3,
    role: "Full Stack Developer",
    company: "Startup X",
    period: "2019 - 2021",
    desc: "Built the entire platform from scratch using the MERN stack and optimized database queries.",
    icon: <FaNodeJs />
  },
  {
    id: 4,
    role: "Junior Developer",
    company: "Freelance",
    period: "2018 - 2019",
    desc: "Started the journey with small web projects, landing pages, and mastering HTML/CSS/JS.",
    icon: <FaCode />
  }
];

const Feature = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const bgLineRef = useRef(null); // اضافه کردن Ref برای خط پس زمینه

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

      // محاسبه ارتفاع دقیق: فاصله بالای کانتینر تا بالای آخرین دایره + نصف ارتفاع دایره
      const calculateHeight = () => {
         if (!lastDot || !timelineInner) return '100%';

         const innerRect = timelineInner.getBoundingClientRect();
         const dotRect = lastDot.getBoundingClientRect();

         // فاصله دایره از بالای کانتینر خودمان
         const height = (dotRect.top - innerRect.top) + (dotRect.height / 2);
         return height;
      };

      const finalHeight = calculateHeight();

      // تنظیم ارتفاع خط پس‌زمینه (خاکستری) تا دقیقا پشت دایره آخر تمام شود
      if (bgLineRef.current) {
        gsap.set(bgLineRef.current, { height: finalHeight });
      }

      // Line animation (نارنجی)
      gsap.fromTo(lineRef.current,
        { height: 0 },
        {
          height: finalHeight, // انیمیشن تا ارتفاع محاسبه شده
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center', // شروع وقتی بالای سکشن به وسط صفحه رسید
            end: `bottom center`, // پایان وقتی پایین سکشن به وسط رسید
            scrub: 1,
            invalidateOnRefresh: true, // محاسبه مجدد در صورت تغییر سایز صفحه
          }
        }
      );

      // Item animations
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

      {/* Hero Section */}
      <section className="hero-section" data-scroll-section>
        <h1 data-scroll data-scroll-speed="0.2">MY CAREER PATH</h1>
        <p data-scroll data-scroll-speed="0.1">Scroll down to explore the journey</p>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section" ref={containerRef} data-scroll-section>
        <div className="timeline-inner">
          {/* اضافه کردن ref به خط پس زمینه برای کنترل ارتفاع */}
          <div ref={bgLineRef} className="line-bg"></div>
          <div ref={lineRef} className="line-progress"></div>

          <div className="items-wrapper">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`timeline-item ${index % 2 === 0 ? 'layout-left' : 'layout-right'}`}>

                {/* Left Side */}
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

                {/* Center Icon */}
                <div className="col-center">
                  <Magnetic>
                    <div className="timeline-dot">
                       <div className="icon-inner">{exp.icon}</div>
                    </div>
                  </Magnetic>
                </div>

                {/* Right Side */}
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
        <h2 data-scroll data-scroll-speed="0.2">TO BE CONTINUED...</h2>
      </section>
    </div>
  );
};

export default Feature;