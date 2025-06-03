import { Footer, Layout, Navbar, LocaleSwitch } from 'nextra-theme-docs'
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

const navbar = (
  <Navbar
    logo={<TitleFullWithLogo />}
    projectLink="https://github.com/UNIkeEN/SJMCL"
  >
    <LocaleSwitch />
  </Navbar>
)
const footer = (
  <Footer>
    沪 ICP 备 05052060 号-7
    <br/>
    {new Date().getFullYear()} © SJMCL Team.
  </Footer>
)
 
export default async function RootLayout({ children, params }) {
  const { lang } = await params
  let pageMap = await getPageMap(`/${lang}`)
  
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
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/UNIkeEN/SJMCL/tree/main"
          footer={footer}
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'zh', name: '中文' }
          ]}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}