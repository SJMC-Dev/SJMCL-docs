import { Footer, Layout, Navbar, LastUpdated } from 'nextra-theme-docs'
import { TitleFullWithLogo } from '../components/logo-title'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { localeResources } from '../../locales'
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

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  let pageMap = await getPageMap(`/${lang}`)
  const t = localeResources[lang || 'en'].translation

  const navbar = (
    <Navbar
      logo={<TitleFullWithLogo />}
      projectLink="https://github.com/UNIkeEN/SJMCL"
    >
    </Navbar>
  )

  const search = (
    <Search
      placeholder={t.search.placeholder}
    />
  )

  const footer = (
    <Footer>
      沪 ICP 备 05052060 号-7
      <br />
      {new Date().getFullYear()} © {t.footer.copyright}
    </Footer>
  )

  return (
    <Layout
      // banner={banner}
      navbar={navbar}
      search={search}
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/UNIkeEN/SJMCL/tree/main"
      footer={footer}
      editLink={t.editLink}
      feedback={{ content: t.feedbackLink }}
      lastUpdated={<LastUpdated>{t.lastUpdated}</LastUpdated>}
      i18n={Object.entries(localeResources).map(([locale, value]) => ({
        locale, name: value.display_name,
      }))}
    >
      {children}
    </Layout>
  )
}