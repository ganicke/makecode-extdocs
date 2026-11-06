// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import ImageFigure from './components/ImageFigure.vue'
//import './custom.css' // <-- Import your custom styling variables here!

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the component globally
    app.component('ImageFigure', ImageFigure)
  }
}