import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/makecode-extdocs/', 

  title: "MakeCode Guides",
  description: "MakeCode guides, how-to's, activities and projects.",
  themeConfig: {
    // Multi-sidebar maps exact directory strings to an array of nav groups
    sidebar: {
      '/microbit/': [
        {
          text: 'micro:bit',
          link: '/microbit/',
          collapsed: false,
          items: [
            { text: 'Encoded Name Tag', link: '/microbit/encoded-name-tag' }
          ]
        }
      ],
      '/arcade/': [
        {
          text: 'arcade',
          link: '/arcade/',
          collapsed: false,
          items: [
            { text: 'Arcade Dummy Guide', link: '/arcade/dummy' }
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
