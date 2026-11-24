// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import ImageFigure from './components/ImageFigure.vue'
import MoreInfo from './components/MoreInfo.vue'
import MicrobitDisplay from './components/MicrobitDisplay.vue'
import MakeCodeBlocks from './components/MakeCodeBlocks.vue'
import ArrayDisplay from './components/ArrayDisplay.vue'
import SideBySide from './components/SideBySide.vue'
//import './custom.css' // <-- Import your custom styling variables here!

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the component globally
    app.component('ImageFigure', ImageFigure)
    app.component('MoreInfo', MoreInfo)
    app.component('MicrobitDisplay', MicrobitDisplay)
    app.component('MakeCodeBlocks', MakeCodeBlocks)
    app.component('ArrayDisplay', ArrayDisplay)
    app.component('SideBySide', SideBySide)
  }
}
