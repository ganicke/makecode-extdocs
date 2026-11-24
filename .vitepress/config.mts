import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/makecode-extdocs/', 

  title: "MakeCode Guides",
  description: "MakeCode guides, how-to's, activities and projects.",
  themeConfig: {
    // Multi-sidebar maps exact directory strings to an array of nav groups
    sidebar: {
      '/docs/microbit/': [
        {
          text: 'micro:bit',
          link: '/docs/microbit/',
          collapsed: false,
          items: [
            { text: 'QR-bit: Encoded Name Tag', link: '/docs/microbit/qrbit-name-tag' }
          ]
        }
      ],
      '/docs/arcade/': [
        {
          text: 'arcade',
          link: '/docs/arcade/',
          collapsed: false,
          items: [
            { text: 'Arcade Dummy Guide', link: '/docs/arcade/dummy' }
          ]
        }
      ]
    },
    editLink: {
      pattern: 'https://github.com/ganicke/makecode-extdocs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://ganicke.github.io/makecode-extdocs' }
    ]
  }
})
