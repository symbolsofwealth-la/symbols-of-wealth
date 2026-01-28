import ScrollToTop from '../components/ScrollToTop'

export const metadata = {
  title: 'Symbols of Wealth',
  description: 'UK music and culture',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
        <ScrollToTop />
        {children}
      </body>
    </html>
  )
}
