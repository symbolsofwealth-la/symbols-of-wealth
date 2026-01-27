'use client'
import { useState, useEffect } from 'react'

export default function Navigation({ menuItems, fontColor, socialLinks }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Lock/unlock scroll when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleImageChange = (newImage) => {
    if (newImage === hoveredImage) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setHoveredImage(newImage)
      setIsTransitioning(false)
    }, 100)
  }

  return (
    <>
      {/* Hamburger/Close Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 10001,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          fontSize: '30px',
          fontWeight: 'normal',
          lineHeight: 1,
          color: '#000'
        }}
      >
        {isOpen ? '×' : '☰'}
      </button>

      {/* Search Button */}
      <button
        onClick={() => {/* Search functionality to be implemented */}}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10001,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 1,
          color: '#000',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          letterSpacing: '0.05em'
        }}
      >
        SEARCH
      </button>

      {/* Heavy Blur Backdrop */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          background: 'rgba(255,255,255,0.1)'
        }} />
      )}

      {/* Menu Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '60vh',
          zIndex: 10000,
          background: hoveredImage 
            ? `url(${hoveredImage}) repeat-x center/auto 100%`
            : '#fff',
          filter: isTransitioning ? 'blur(30px)' : 'blur(0px)',
          opacity: isTransitioning ? 0.5 : 1,
          transition: 'filter 0.1s ease, opacity 0.1s ease'
        }}>
          {/* Menu Items */}
          <nav style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: '25px'
          }}>
            {menuItems?.map((item, index) => (
              <a
                key={index}
                href={'#'}
                onClick={(e) => { if (item.slug?.current) { e.preventDefault(); window.location.href = '/' + item.slug.current; }}}
                onMouseEnter={() => handleImageChange(item.hoverImage?.asset?.url || null)}
                onMouseLeave={() => handleImageChange(null)}
                style={{
                  fontSize: '70px',
                  fontWeight: 'bold',
                  color: fontColor || '#000',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: '"Helvetica Neue LT Std", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  letterSpacing: '0.02em',
                  opacity: hoveredImage && hoveredImage !== item.hoverImage?.asset?.url ? 0.3 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Social Icons */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '40px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            zIndex: 3
          }}>
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                style={{ color: fontColor || '#000', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
                IG
              </a>
            )}
            {socialLinks?.email && (
              <a href={`mailto:${socialLinks.email}`} 
                style={{ color: fontColor || '#000', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
                @
              </a>
            )}
            {socialLinks?.pinterest && (
              <a href={socialLinks.pinterest} target="_blank" rel="noopener noreferrer" 
                style={{ color: fontColor || '#000', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
                P
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}