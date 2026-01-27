import ScrollToTop from '../components/ScrollToTop'
import { client } from '@/lib/sanity'
import { generateFontFaceCSS } from '@/lib/fonts'

export const metadata = {
  title: 'Symbols of Wealth',
  description: 'UK music and culture',
}

async function getCustomFonts() {
  const query = `*[_type == "fontSettings"]{
    fontName,
    fontWeight,
    fontStyle,
    "woff2Url": fontFileWoff2.asset->url,
    "woffUrl": fontFileWoff.asset->url,
    "ttfUrl": fontFileTtf.asset->url
  }`
  return await client.fetch(query)
}

export default async function RootLayout({ children }) {
  const customFonts = await getCustomFonts()
  const fontCSS = generateFontFaceCSS(customFonts)

  // Debug: Log custom fonts and generated CSS
  console.log('Custom fonts fetched:', customFonts)
  console.log('Generated @font-face CSS:', fontCSS)

  return (
    <html lang="en">
      <head>
        {fontCSS && <style dangerouslySetInnerHTML={{ __html: fontCSS }} />}
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
        <ScrollToTop />
        {children}
      </body>
    </html>
  )
}