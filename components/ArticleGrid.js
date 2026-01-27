'use client'
import { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/lib/imageUrl'

export default function ArticleGrid({ articles }) {
  if (!articles || articles.length === 0) return null

  return (
    <section style={{
      padding: '60px 40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 800px), 800px))',
      gap: '40px',
      justifyContent: 'start',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {articles.map((article, index) => (
        <ArticleCard key={article._id || index} article={article} />
      ))}
    </section>
  )
}

function ArticleCard({ article }) {
  const [isHovered, setIsHovered] = useState(false)

  // Debug: Log all article data
  console.log('Article data:', article)
  console.log('Title font family:', article.titleFontFamily)
  console.log('Custom title font name:', article.customTitleFontName)

  // Debug font selection
  const selectedFont = article.titleFontFamily === 'custom' && article.customTitleFontName 
    ? `"${article.customTitleFontName}", Arial, sans-serif`
    : (article.titleFontFamily ? `"${article.titleFontFamily}", Arial, sans-serif` : '"Helvetica Neue", Arial, sans-serif')
  
  console.log('Article font debug:', {
    title: article.title,
    titleFontFamily: article.titleFontFamily,
    customTitleFontName: article.customTitleFontName,
    selectedFont: selectedFont
  })

  return (
    <Link href={`/article/${article.slug?.current || ''}`} style={{ textDecoration: 'none' }}>
      <article style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '800px',
        cursor: 'pointer'
      }}>
        <div 
          style={{
            width: '100%',
            maxWidth: '800px',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
            background: '#000',
            position: 'relative',
            borderRadius: '6px'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={article.featuredImage ? urlFor(article.featuredImage).width(800).height(800).fit('crop').url() : ''}
            alt={article.title || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
              transition: isHovered 
                ? 'transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                : 'transform 0.3s ease-out'
            }}
          />
        </div>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          margin: 0,
          marginTop: '-8px',
          color: '#000',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          fontFamily: selectedFont,
          background: 'transparent'
        }}>
          {article.title}
        </h2>
      </article>
    </Link>
  )
}