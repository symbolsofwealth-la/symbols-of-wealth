import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import SpiralHero from '@/components/SpiralHero'
import ArticleGrid from '@/components/ArticleGrid'
import SmallArticleGrid from '@/components/SmallArticleGrid'
import AdUnit from '@/components/AdUnit'
import Footer from '@/components/Footer'

async function getHomepage() {
  const query = `*[_type == "page" && slug.current == "homepage"][0]{
    backgroundColor,
    modules[]{
      _type,
      _key,
      images[]{
        asset->{
          _id,
          url
        }
      },
      backgroundType,
      backgroundColor,
      backgroundImage{
        asset->{
          url
        }
      },
      backgroundVideo,
      articles[]->{
        _id,
        title,
        titleColor,
        titleFontFamily,
        customTitleFontName,
        fontFamily,
        customFontName,
        slug,
        featuredImage{
          asset->{
            url
          }
        }
      },
      isActive,
      contentType,
      adImage{
        asset->{
          url
        }
      },
      adVideo{
        asset->{
          url
        }
      },
      customHTML,
      linkUrl,
      fallbackText,
      fallbackLink,
      adBlockerFallbackMessage
    }
  }`
  return await client.fetch(query)
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

export default async function HomePage() {
  const homepage = await getHomepage()
  const navData = await getNavigation()

  // Debug: Log the data to see what's being fetched
  console.log('Homepage data:', homepage)
  console.log('Background color:', homepage?.backgroundColor)

  return (
    <main style={{ 
      background: homepage?.backgroundColor || '#FFFFFF',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <Navigation 
        menuItems={navData?.menuItems}
        fontColor={navData?.fontColor}
        socialLinks={navData?.socialLinks}
      />
      <Header />
      
      {homepage?.modules?.map((module, index) => {
        switch (module._type) {
          case 'heroModule':
            return (
              <SpiralHero
                key={module._key || index}
                images={module.images || []}
                backgroundType={module.backgroundType}
                backgroundColor={module.backgroundColor}
                backgroundImage={module.backgroundImage}
                backgroundVideo={module.backgroundVideo}
              />
            )
          case 'articleGridModule':
            return <ArticleGrid key={module._key || index} articles={module.articles || []} />
          case 'smallArticleGridModule':
            return <SmallArticleGrid key={module._key || index} articles={module.articles || []} />
          case 'adUnitModule':
            return <AdUnit key={module._key || index} module={module} />
          default:
            return null
        }
      })}
      <Footer />
    </main>
  )
}