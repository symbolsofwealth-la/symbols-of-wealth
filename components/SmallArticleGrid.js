import Link from 'next/link'
import { urlFor } from '@/lib/imageUrl'

export default function SmallArticleGrid({ articles }) {
  if (!articles || articles.length === 0) return null

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .small-article-grid-inner {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .small-article-grid-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <section style={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        padding: '60px 20px'
      }}>
        <div 
          className="small-article-grid-inner"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            width: '100%',
            maxWidth: '1400px',
            boxSizing: 'border-box',
            padding: '0 20px'
          }}>
      {articles.map((article, index) => {
        // Debug font selection
        const selectedFont = article.titleFontFamily === 'custom' && article.customTitleFontName 
          ? `"${article.customTitleFontName}", Arial, sans-serif`
          : (article.titleFontFamily ? `"${article.titleFontFamily}", Arial, sans-serif` : '"Helvetica Neue", Arial, sans-serif')
        
        console.log('Small article font debug:', {
          title: article.title,
          titleFontFamily: article.titleFontFamily,
          customTitleFontName: article.customTitleFontName,
          selectedFont: selectedFont
        })

        return (
          <Link key={article._id || index} href={`/article/${article.slug?.current || ''}`} style={{ textDecoration: 'none' }}>
            <article style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              cursor: 'pointer'
            }}>
                <div style={{
                  width: '100%',
                  height: '300px',
                  overflow: 'hidden',
                  background: '#000',
                  borderRadius: '6px'
                }}>
              <img
                src={article.featuredImage ? urlFor(article.featuredImage).width(600).height(300).fit('crop').url() : ''}
                alt={article.title || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                margin: 0,
                marginTop: '-4px',
                color: article.titleColor || '#000',
                lineHeight: 1.3,
                fontFamily: selectedFont
              }}>
                {article.title}
              </h3>
            </article>
          </Link>
        )
      })}
        </div>
      </section>
    </>
  )
}