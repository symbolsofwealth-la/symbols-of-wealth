'use client'
import { useEffect } from 'react'

export default function FontLoader({ fonts }) {
  useEffect(() => {
    if (!fonts || fonts.length === 0) return

    // Generate @font-face CSS
    const fontFaceCSS = fonts.map(font => {
      if (!font.fontUrl) return ''
      
      return `
        @font-face {
          font-family: "${font.fontName}";
          src: url("${font.fontUrl}") format("woff2"),
               url("${font.fontUrl}") format("woff"),
               url("${font.fontUrl}") format("truetype");
          font-weight: ${font.fontWeight || '400'};
          font-style: ${font.fontStyle || 'normal'};
          font-display: swap;
        }
      `
    }).join('\n')

    // Create or update style tag
    let styleTag = document.getElementById('custom-fonts')
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'custom-fonts'
      document.head.appendChild(styleTag)
    }
    styleTag.textContent = fontFaceCSS
  }, [fonts])

  return null
}
