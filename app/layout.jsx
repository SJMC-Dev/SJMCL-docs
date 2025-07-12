import { ColorModeSyncWrapper } from './components/color-mode-wrapper'
import { Head } from 'nextra/components'
import './styles/global.css'

export default function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <ColorModeSyncWrapper>
          {children}
        </ColorModeSyncWrapper>
      </body>
    </html>
  )
}
