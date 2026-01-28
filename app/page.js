'use client'
import { useState, useEffect } from 'react'
import Script from 'next/script'

export default function HoldingPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [mouseX, setMouseX] = useState(null)
  const [mouseY, setMouseY] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const colors = ['#FF4444', '#FF6B6B', '#FF8A8A', '#E85D5D', '#FF5252', '#E67373']

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // Interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    if (!rgb1 || !rgb2) return color1
    
    const r = rgb1.r + (rgb2.r - rgb1.r) * factor
    const g = rgb1.g + (rgb2.g - rgb1.g) * factor
    const b = rgb1.b + (rgb2.b - rgb1.b) * factor
    
    return rgbToHex(r, g, b)
  }

  // Calculate background color based on mouse position
  const getBackgroundColor = () => {
    if (mouseX === null) return '#FF0000' // Default color
    
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const normalizedX = Math.max(0, Math.min(1, mouseX / viewportWidth))
    
    // Map normalized position (0-1) to color index
    const colorIndex = normalizedX * (colors.length - 1)
    const lowerIndex = Math.floor(colorIndex)
    const upperIndex = Math.ceil(colorIndex)
    const factor = colorIndex - lowerIndex
    
    // Interpolate between adjacent colors
    return interpolateColor(colors[lowerIndex], colors[upperIndex], factor)
  }

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        // Trigger blur out effect
        setStatus('success')
        // Wait for blur out, then show success message
        setTimeout(() => {
          setShowSuccess(true)
        }, 300)
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Glitch canvas - Background layer */}
      <canvas 
        id="glitch-canvas" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />
      
      {/* Load glitchGL.min.js script */}
      <Script 
        src="/glitchGL.min.js" 
        strategy="afterInteractive"
        onLoad={() => {
          const canvas = document.getElementById('glitch-canvas');
          if (canvas && window.glitchGL) {
            new window.glitchGL(canvas, {
              amount: 0.02,
              seed: 0.5
            });
          }
        }} 
      />

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: getBackgroundColor(),
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'TWK Lausanne', sans-serif",
        transition: 'background-color 0.8s ease-out',
        zIndex: 1
      }}>
      {/* Rose lockup - Centered with multiply blend */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mixBlendMode: 'multiply'
      }}>
        <img 
          src="/SOW_lockup.png"
          alt="Symbols of Wealth"
          style={{ 
            width: '448px', 
            height: 'auto',
            maxWidth: '80vw'
          }}
        />
      </div>

      {/* Bottom section - Email input field */}
      <div className="email-signup-container" style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          {!showSuccess ? (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            width: '100%',
            position: 'relative',
            filter: status === 'success' ? 'blur(10px)' : 'blur(0px)',
            transition: 'filter 0.3s ease-out',
            opacity: status === 'success' ? 0 : 1
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? '' : 'sign up for updates here'}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px 50px 12px 16px',
                fontSize: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: '#000',
                outline: 'none',
                fontWeight: '400',
                textAlign: 'center',
                fontFamily: "'TWK Lausanne', sans-serif"
              }}
            />

            {email && (
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  padding: '8px',
                  fontSize: '16px',
                  color: '#000',
                  opacity: isSubmitting ? 0.3 : 1,
                  transition: 'opacity 0.2s',
                  fontFamily: "'TWK Lausanne', sans-serif"
                }}
              >
                ↳
              </button>
            )}
          </form>
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ 
              color: '#000', 
              fontSize: '12px', 
              margin: 0,
              textAlign: 'center',
              fontFamily: "'TWK Lausanne', sans-serif",
              filter: showSuccess ? 'blur(0px)' : 'blur(10px)',
              transition: 'filter 0.3s ease-out',
              width: '100%'
            }}>
              Thanks! news incoming....
            </p>
          </div>
        )}

        {status === 'error' && !showSuccess && (
          <p style={{ 
            color: '#000', 
            fontSize: '12px', 
            margin: '10px 0 0 0',
            textAlign: 'center',
            fontFamily: "'TWK Lausanne', sans-serif"
          }}>
            Error - try again?
          </p>
        )}
        </div>
      </div>

      {/* Instagram link - Bottom right */}
      <a
        href="https://www.instagram.com/symbolsofwealth/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '40px',
          color: '#000',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      {/* CSS for custom font and black placeholder */}
      <style jsx>{`
        @font-face {
          font-family: 'TWK Lausanne';
          src: url('/fonts/TWKLausanne-500.woff2') format('woff2'),
               url('/fonts/TWKLausanne-500.woff') format('woff'),
               url('/fonts/TWKLausanne-500.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
        }
        
        input::placeholder {
          color: #000;
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .email-signup-container {
            max-width: 90% !important;
            padding: 0 20px !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}