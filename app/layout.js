import ScrollToTop from '../components/ScrollToTop'

export const metadata = {
  title: 'Symbols of Wealth',
  description: 'UK music and culture',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WDYSG2YNHD"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WDYSG2YNHD');
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
        <ScrollToTop />
        {children}
      </body>
    </html>
  )
}
