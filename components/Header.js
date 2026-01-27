'use client'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 600
      const progress = Math.min(window.scrollY / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fontSize = 140 - (scrollProgress * 60) // 120px -> 60px
  const scale = 1 - (scrollProgress * 0.5) // 1 -> 0.5
  
  // Start near bottom (calc(100vh - 150px)), end at top (20px)
  const topPosition = `calc(${100 - (scrollProgress * 95)}vh - ${150 - (scrollProgress * 130)}px)`

  return (
    <header
      style={{
        position: 'fixed',
        top: topPosition,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        zIndex: 1000,
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      <h1
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          margin: 0,
          color: '#000',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 1,
          fontFamily: '"Helvetica Neue LT Std", "Helvetica Neue", Helvetica, Arial, sans-serif',
          transform: 'scaleY(2.4)',
          transformOrigin: 'center'
        }}
      >
        SYMBOLS OF WEALTH
      </h1>
    </header>
  )
}