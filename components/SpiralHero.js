'use client'
import { useEffect, useRef, useState } from 'react'

export default function SpiralHero({ images, backgroundType, backgroundColor, backgroundImage, backgroundVideo }) {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const startTimeRef = useRef(Date.now())
  const mouseRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 })
  
  const [imageStates, setImageStates] = useState(() => {
    if (typeof window === 'undefined') return []
    
    const configs = []
    // Scale down image size based on number of images
    const imageCount = images.length
    const baseSize = imageCount > 6 ? 150 : imageCount > 4 ? 175 : 150
    const sizeRange = imageCount > 6 ? 75 : imageCount > 4 ? 100 : 125
    const minDistance = imageCount > 6 ? 400 : 500
    
    images.forEach((_, i) => {
      let x, y, width, height, attempts = 0
      const maxAttempts = 100
      
      do {
        width = baseSize + Math.random() * sizeRange
        height = width * 0.75 // Rough estimate for collision checking
        x = Math.random() * (window.innerWidth - width - 100) + 50
        y = Math.random() * (window.innerHeight - height - 100) + 50
        attempts++
        
        // Check if this position overlaps with existing configs
        const overlaps = configs.some(c => {
          const estimatedHeight = c.width * 0.75
          const dx = Math.abs((c.x + c.width/2) - (x + width/2))
          const dy = Math.abs((c.y + estimatedHeight/2) - (y + height/2))
          return dx < (c.width + width)/2 + minDistance/2 && 
                 dy < (estimatedHeight + height)/2 + minDistance/2
        })
        
        if (!overlaps) break
        
      } while (attempts < maxAttempts)
      
      configs.push({
        startX: x,
        startY: y,
        x: x,
        y: y,
        width: width,
        height: null,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        trail: []
      })
    })
    
    return configs
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!images.length) return

    let animationFrameId
    let frameCount = 0
    const DELAY = 2000
    const MAX_TRAIL_LENGTH = 60

    const checkCollision = (state1, state2) => {
      if (!state1.height || !state2.height) return false
      
      const padding = 20 // Add padding so they don't stick together
      
      return !(
        state1.x + state1.width + padding < state2.x ||
        state1.x > state2.x + state2.width + padding ||
        state1.y + state1.height + padding < state2.y ||
        state1.y > state2.y + state2.height + padding
      )
    }

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const isMoving = elapsed > DELAY
      
      if (isMoving) {
        setImageStates(prevStates => 
          prevStates.map((state, index) => {
            let newVx = state.vx
            let newVy = state.vy
            
            // Subtle magnetic pull toward cursor
            const dx = mouseRef.current.x - (state.x + state.width / 2)
            const dy = mouseRef.current.y - (state.y + (state.height || 0) / 2)
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance > 0) {
              newVx += (dx / distance) * 0.002
              newVy += (dy / distance) * 0.002
            }
            
            let newX = state.x + newVx
            let newY = state.y + newVy
            
            // Check collision with other images
            prevStates.forEach((otherState, otherIndex) => {
              if (index !== otherIndex && otherState.height) {
                const futureState = { ...state, x: newX, y: newY }
                if (checkCollision(futureState, otherState)) {
                  // Calculate push-away direction
                  const centerX1 = state.x + state.width / 2
                  const centerY1 = state.y + state.height / 2
                  const centerX2 = otherState.x + otherState.width / 2
                  const centerY2 = otherState.y + otherState.height / 2
                  
                  const pushX = centerX1 - centerX2
                  const pushY = centerY1 - centerY2
                  const pushDist = Math.sqrt(pushX * pushX + pushY * pushY)
                  
                  if (pushDist > 0) {
                    newVx = (pushX / pushDist) * 0.5
                    newVy = (pushY / pushDist) * 0.5
                  }
                }
              }
            })
            
            // Bounce off walls
            if (newX <= 0) {
              newX = 0
              newVx = Math.abs(newVx)
            }
            if (state.width && newX + state.width >= window.innerWidth) {
              newX = window.innerWidth - state.width
              newVx = -Math.abs(newVx)
            }
            if (newY <= 0) {
              newY = 0
              newVy = Math.abs(newVy)
            }
            if (state.height && newY + state.height >= window.innerHeight) {
              newY = window.innerHeight - state.height
              newVy = -Math.abs(newVy)
            }
            
            // Add to trail every 25 frames
            let newTrail = state.trail
            if (frameCount % 25 === 0) {
              newTrail = [...state.trail, { x: state.x, y: state.y }]
              if (newTrail.length > MAX_TRAIL_LENGTH) {
                newTrail = newTrail.slice(-MAX_TRAIL_LENGTH)
              }
            }
            
            return {
              ...state,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              trail: newTrail
            }
          })
        )
        frameCount++
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrameId)
  }, [images])

  if (!images.length) {
    return <div style={{ height: '100vh', background: '#000' }} />
  }

  if (isMobile) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Mobile version coming soon</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      style={{
        height: '100vh',
        background: backgroundType === 'color' 
          ? (backgroundColor || '#000')
          : backgroundType === 'image' && backgroundImage?.asset?.url
          ? `url(${backgroundImage.asset.url}) center/cover no-repeat`
          : '#000',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Video background if selected */}
      {backgroundType === 'video' && backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {imageStates.map((state, imageIndex) => {
        const image = images[imageIndex]
        const trailBaseZ = imageIndex * 100
        const leadZ = 10000 + imageIndex
        
        return (
          <div key={imageIndex}>
            {/* Trail - NO OPACITY */}
            {state.trail.map((pos, trailIndex) => (
              <img
                key={`trail-${trailIndex}`}
                src={image.asset.url}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${state.width}px`,
                  height: 'auto',
                  pointerEvents: 'none',
                  zIndex: trailBaseZ + trailIndex
                }}
              />
            ))}
            
            {/* Lead image */}
            <img
              src={image.asset.url}
              alt=""
              onLoad={(e) => {
                const img = e.target
                const aspectRatio = img.naturalHeight / img.naturalWidth
                const actualHeight = state.width * aspectRatio
                
                setImageStates(prev => 
                  prev.map((s, i) => 
                    i === imageIndex ? { ...s, height: actualHeight } : s
                  )
                )
              }}
              style={{
                position: 'absolute',
                left: `${state.x}px`,
                top: `${state.y}px`,
                width: `${state.width}px`,
                height: 'auto',
                pointerEvents: 'none',
                zIndex: leadZ
              }}
            />
          </div>
        )
      })}
    </div>
  )
}