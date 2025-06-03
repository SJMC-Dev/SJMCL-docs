import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { TitleFullWithLogo } from './components/logo-title'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
 
export const metadata = {
  applicationName: 'SJMCL',
  appleWebApp: {
    title: 'SJMCL Docs'
  },
  metadataBase: new URL('https://mc.sjtu.cn/sjmcl'),
  other: {
    'msapplication-TileColor': '#fff'
  },
  title: {
    default: 'SJMC Launcher',
    template: '%s | SJMCL'
  },
}
 
// const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<TitleFullWithLogo />}
    projectLink="https://github.com/UNIkeEN/SJMCL"
  />
)
const footer = <Footer>{new Date().getFullYear()} © SJMCL Team.</Footer>
 
export default async function RootLayout({ children }) {
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
        <Layout
          // banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/UNIkeEN/SJMCL/tree/main"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}