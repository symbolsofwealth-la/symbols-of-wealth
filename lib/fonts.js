import { client } from './sanity'

export async function getCustomFonts() {
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

export function generateFontFaceCSS(fonts) {
  if (!fonts || fonts.length === 0) return ''
  
  return fonts.map(font => {
    // Build src with all available formats (browser picks best one)
    const srcParts = []
    if (font.woff2Url) srcParts.push(`url("${font.woff2Url}") format("woff2")`)
    if (font.woffUrl) srcParts.push(`url("${font.woffUrl}") format("woff")`)
    if (font.ttfUrl) srcParts.push(`url("${font.ttfUrl}") format("truetype")`)
    
    if (srcParts.length === 0) return ''
    
    return `
      @font-face {
        font-family: "${font.fontName}";
        src: ${srcParts.join(',\n             ')};
        font-weight: ${font.fontWeight || '400'};
        font-style: ${font.fontStyle || 'normal'};
        font-display: swap;
      }
    `
  }).join('\n')
}
