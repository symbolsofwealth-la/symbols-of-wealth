'use client'

import Link from 'next/link'

export default function AdUnit({ module }) {
  if (!module) return null

  const {
    isActive,
    backgroundColor,
    backgroundImage,
    contentType,
    adImage,
    adVideo,
    customHTML,
    linkUrl,
    fallbackText,
    fallbackLink
  } = module

  // Fallback view (when ad is not active)
  if (!isActive) {
    return (
      <section style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent'
      }}>
        <div style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '80px 60px',
          background: backgroundColor || '#000',
          backgroundImage: backgroundImage?.asset?.url ? `url(${backgroundImage.asset.url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Link 
            href={fallbackLink || '/advertising'} 
            style={{
              textDecoration: 'none',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {fallbackText || 'How To Rent This Unit'}
          </Link>
        </div>
      </section>
    )
  }

  // Active ad view
  const content = () => {
    switch (contentType) {
      case 'image':
        return adImage?.asset?.url ? (
          <img
            src={adImage.asset.url}
            alt="Advertisement"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : null

      case 'video':
        return adVideo?.asset?.url ? (
          <video
            src={adVideo.asset.url}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : null

      case 'html':
        return customHTML ? (
          <div dangerouslySetInnerHTML={{ __html: customHTML }} />
        ) : null

      default:
        return null
    }
  }

  const adContent = (
    <section style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '0 60px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          minHeight: '400px',
          width: '100%',
          background: backgroundColor || '#000',
          backgroundImage: backgroundImage?.asset?.url ? `url(${backgroundImage.asset.url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {content()}
        </div>
      </div>
    </section>
  )

  // Wrap in link if URL provided
  if (linkUrl) {
    return (
      <a 
        href={linkUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none' }}
      >
        {adContent}
      </a>
    )
  }

  return adContent
}