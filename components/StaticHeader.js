import Link from 'next/link'

export default function StaticHeader() {
  return (
    <Link 
      href="/"
      style={{
        position: 'fixed',
        top: 'calc(5vh - 28px)',
        left: 0,
        right: 0,
        zIndex: 9999,
        textAlign: 'center',
        textDecoration: 'none',
        pointerEvents: 'auto'
      }}
    >
      <h1 style={{
        fontSize: '80px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        margin: 0,
        color: '#000',
        transform: 'scaleY(2.4) scale(0.5)',
        transformOrigin: 'top center',
        fontFamily: '"Helvetica Neue LT Std", "Helvetica Neue", Helvetica, Arial, sans-serif',
        lineHeight: 1
      }}>
        SYMBOLS OF WEALTH
      </h1>
    </Link>
  )
}