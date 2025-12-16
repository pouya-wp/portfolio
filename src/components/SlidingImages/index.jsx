'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: "Sepehr Sharareh",
    category: "Portfolio Website",
    year: "2024",
    url: "https://sepehrsharareh.com",
    thumbnail: "/images/projects/sepehr-thumb.jpg",
    tags: ["React", "Three.js", "GSAP"]
  },
]

const ProjectCard = ({ project, onOpen, index }) => {
  const cardRef = useRef(null)
  const iframeRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const scrollAnimation = useRef(null)

  const handleMouseEnter = () => {
    setIsHovered(true)

    // شروع اسکرول بعد از لود iframe
    setTimeout(() => {
      if (iframeRef.current) {
        scrollAnimation.current = gsap.to(iframeRef.current, {
          scrollTop: 2000,
          duration: 8,
          ease: "none",
        })
      }
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (scrollAnimation.current) {
      scrollAnimation.current.kill()
    }
  }

  return (
    <motion.div
      className="project-card"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Project Number */}
      <div className="project-number">
        <span>0{project.id}</span>
      </div>

      {/* Preview Window */}
      <div className="card-preview">
        <div className="preview-header">
          <div className="preview-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-url">{project.url.replace('https://', '')}</div>
        </div>

        <div className="preview-content">
          {/* Thumbnail (default) */}
          <motion.div
            className="preview-thumbnail"
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={project.thumbnail} alt={project.title} width={480} height={320} />
            <div className="thumbnail-overlay">
              <span>Hover to preview</span>
            </div>
          </motion.div>

          {/* Live iframe (on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="preview-iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <iframe
                  ref={iframeRef}
                  src={project.url}
                  title={project.title}
                  scrolling="no"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Info */}
      <div className="card-info-section">
        <div className="card-meta">
          <span className="card-category">{project.category}</span>
          <span className="card-divider">/</span>
          <span className="card-year">{project.year}</span>
        </div>

        <h3 className="card-title">{project.title}</h3>

        <div className="card-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>

        <motion.div
          className="card-cta"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <span>View Project</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        className="card-border-effect"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

const ProjectModal = ({ project, onClose }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-info">
            <h2>{project.title}</h2>
            <div className="modal-meta">
              <span>{project.category}</span>
              <span className="modal-dot">•</span>
              <span>{project.year}</span>
            </div>
          </div>
          <div className="modal-actions">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              <span>Open Site</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button className="modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-iframe-wrapper">
          {isLoading && (
            <div className="modal-loader">
              <motion.div
                className="loader-spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <span>Loading preview...</span>
            </div>
          )}
          <iframe
            src={project.url}
            title={project.title}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section className="portfolio-section">
      <div className="portfolio-container">
        {/* Header */}
        <div className="portfolio-header">
          <motion.div
            className="header-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line"></span>
            <span>Selected Works</span>
          </motion.div>

          <motion.h2
            className="portfolio-title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Featured <span className="title-highlight">Projects</span>
          </motion.h2>

          <motion.p
            className="portfolio-desc"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A collection of my recent work in web development and design
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .portfolio-section {
          padding: 140px 0;
          min-height: 100vh;
          position: relative;
        }

        .portfolio-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Header Styles */
        .portfolio-header {
          margin-bottom: 80px;
        }

        .header-label {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .label-line {
          width: 40px;
          height: 2px;
          background: #ff6b35;
        }

        .header-label span:last-child {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #ff6b35;
          font-weight: 500;
        }

        .portfolio-title {
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 700;
          color: #fff;
          letter-spacing: -3px;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .title-highlight {
          color: #f5f5f5;
          -webkit-text-stroke: 1.5px #ff6b35;
            paint-order: stroke fill;
        }

        .portfolio-desc {
          font-size: 18px;
          color: rgb(0 0 0 / 50%);
          max-width: 500px;
        }

        /* Grid */
        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
        }

        /* Project Card */
        .project-card {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 40px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .project-card:hover {
          background: rgba(255, 107, 53, 0.03);
          border-color: rgba(255, 107, 53, 0.2);
          transform: translateY(-5px);
        }

        /* Project Number */
        .project-number {
          position: absolute;
          top: -20px;
          left: 40px;
          font-size: 100px;
          font-weight: 800;
          color: rgba(255, 107, 53, 0.08);
          line-height: 1;
          pointer-events: none;
          z-index: 0;
        }

        /* Preview Window */
        .card-preview {
          width: 480px;
          height: 320px;
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 1;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .preview-dots {
          display: flex;
          gap: 6px;
        }

        .preview-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }

        .preview-dots span:first-child {
          background: #ff5f57;
        }

        .preview-dots span:nth-child(2) {
          background: #ffbd2e;
        }

        .preview-dots span:last-child {
          background: #28ca42;
        }

        .preview-url {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-family: monospace;
        }

        .preview-content {
          position: relative;
          width: 100%;
          height: calc(100% - 42px);
          overflow: hidden;
        }

        .preview-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .preview-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }

        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail-overlay span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.6);
          padding: 10px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
        }

        .preview-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .preview-iframe iframe {
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: none;
        }

        /* Card Info */
        .card-info-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0;
          position: relative;
          z-index: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .card-category,
        .card-year {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgb(0 0 0 / 51%);
        }

        .card-divider {
          color: #ff6b35;
        }

        .card-title {
          font-size: 36px;
          font-weight: 600;
          color: #ff8600;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }

        .tag {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 16px;
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          border-radius: 20px;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .card-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #ff6b35;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 500;
        }

        .card-cta svg {
          transition: transform 0.3s ease;
        }

        .project-card:hover .card-cta svg {
          transform: translate(5px, -5px);
        }

        .card-border-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 28px;
          border: 2px solid #ff6b35;
          pointer-events: none;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .modal-content {
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          background: #111;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 30px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .modal-info h2 {
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
        }

        .modal-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .modal-dot {
          color: #ff6b35;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #ff6b35;
          color: #fff;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .modal-link:hover {
          background: #ff8555;
          transform: translateY(-2px);
        }

        .modal-close {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 107, 53, 0.2);
          border-color: #ff6b35;
          transform: rotate(90deg);
        }

        .modal-iframe-wrapper {
          flex: 1;
          position: relative;
          background: #000;
        }

        .modal-iframe-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .modal-loader {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .loader-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #ff6b35;
          border-radius: 50%;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .project-card {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .card-preview {
            width: 100%;
            height: 280px;
          }

          .project-number {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .portfolio-container {
            padding: 0 20px;
          }

          .portfolio-title {
            letter-spacing: -1px;
          }

          .card-title {
            font-size: 28px;
          }

          .modal-backdrop {
            padding: 0;
          }

          .modal-content {
            height: 100%;
            border-radius: 0;
          }

          .modal-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .modal-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </section>
  )
}

export default Portfolio