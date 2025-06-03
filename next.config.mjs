import nextra from 'nextra'
 
// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
  unstable_shouldAddLocaleToLinks: true
})
 
// Export the final Next.js config with Nextra included
export default withNextra({
  basePath: '/sjmcl',
  output: 'export',
  images: {
    unoptimized: true // mandatory, otherwise won't export
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh'
  },
  turbopack: {
    resolveAlias: {
      // Path to your `mdx-components` file with extension
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})