import { client } from '@/lib/sanity'
import StaticHeader from '@/components/StaticHeader'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

async function getArticle(slug) {
  const query = `*[_type in ["article", "smallArticle"] && slug.current == $slug][0]{
    _id,
    title,
    slug,
    titleColor,
    titleFontFamily,
    featuredImage{
      asset->{
        url
      }
    },
    content[]{
      _type,
      _key,
      text,
      level,
      fontFamily,
      customFontName,
      image{
        asset->{
          url
        }
      },
      caption,
      quote,
      author,
      height
    }
  }`
  return await client.fetch(query, { slug })
}

async function getNavigation() {
  const query = `*[_type == "navigation"][0]{
    menuItems[]{
      title,
      slug,
      hoverImage{
        asset->{
          url
        }
      }
    },
    fontColor,
    socialLinks
  }`
  return await client.fetch(query)
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  const navData = await getNavigation()

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <main>
      <Navigation 
        menuItems={navData?.menuItems}
        fontColor={navData?.fontColor}
        socialLinks={navData?.socialLinks}
      />
      <StaticHeader />
      
      <article style={{
        maxWidth: '900px',
        margin: '120px auto 80px',
        padding: '0 40px'
      }}>
        {/* Render modules */}
        {article.content?.map((module, index) => {
          switch (module._type) {
            case 'headerModule':
              const HeaderTag = module.level || 'h2'
              const sizes = { h1: '48px', h2: '36px', h3: '24px' }
              const headerFont = module.fontFamily === 'custom' && module.customFontName 
                ? `"${module.customFontName}", Arial, sans-serif`
                : (module.fontFamily ? `"${module.fontFamily}", Arial, sans-serif` : '"Helvetica Neue", Arial, sans-serif')
              
              console.log('Header module font debug:', {
                text: module.text,
                fontFamily: module.fontFamily,
                customFontName: module.customFontName,
                headerFont: headerFont
              })
              
              return (
                <HeaderTag 
                  key={module._key || index}
                  style={{
                    fontSize: sizes[module.level] || '36px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    marginTop: index > 0 ? '40px' : '0',
                    color: '#000',
                    fontFamily: headerFont
                  }}
                >
                  {module.text}
                </HeaderTag>
              )
            
            case 'paragraphModule':
              const paragraphFont = module.fontFamily === 'custom' && module.customFontName 
                ? `"${module.customFontName}", Arial, sans-serif`
                : (module.fontFamily ? `"${module.fontFamily}", Arial, sans-serif` : '"Helvetica Neue", Arial, sans-serif')
              
              console.log('Paragraph module font debug:', {
                text: module.text?.substring(0, 30),
                fontFamily: module.fontFamily,
                customFontName: module.customFontName,
                paragraphFont: paragraphFont
              })
              
              return (
                <p 
                  key={module._key || index}
                  style={{
                    fontSize: '18px',
                    lineHeight: 1.7,
                    marginBottom: '24px',
                    color: '#000',
                    fontFamily: paragraphFont
                  }}
                >
                  {module.text}
                </p>
              )
            
            case 'imageModule':
              return (
                <figure 
                  key={module._key || index}
                  style={{
                    margin: '40px 0',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={module.image?.asset?.url}
                    alt={module.caption || ''}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '6px'
                    }}
                  />
                  {module.caption && (
                    <figcaption style={{
                      fontSize: '14px',
                      color: '#666',
                      marginTop: '12px',
                      fontStyle: 'italic'
                    }}>
                      {module.caption}
                    </figcaption>
                  )}
                </figure>
              )
            
            case 'quoteModule':
              return (
                <blockquote 
                  key={module._key || index}
                  style={{
                    fontSize: '24px',
                    fontStyle: 'italic',
                    margin: '40px 0',
                    padding: '20px 40px',
                    borderLeft: '4px solid #000',
                    color: '#333'
                  }}
                >
                  "{module.quote}"
                  {module.author && (
                    <cite style={{
                      display: 'block',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      marginTop: '12px',
                      color: '#666'
                    }}>
                      — {module.author}
                    </cite>
                  )}
                </blockquote>
              )
            
            case 'spacerModule':
              const heights = { small: '40px', medium: '80px', large: '120px' }
              return (
                <div 
                  key={module._key || index}
                  style={{
                    height: heights[module.height] || '80px'
                  }}
                />
              )
            
            default:
              return null
          }
        })}
      </article>
      <Footer />
    </main>
  )
}