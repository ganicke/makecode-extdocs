// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import ImageFigure from './components/ImageFigure.vue'
import MoreInfo from './components/MoreInfo.vue'
import MicrobitDisplay from './components/MicrobitDisplay.vue'
//import Base26Encoder from './components/Base26Encoder.vue'
//import CharSetRange from './components/CharSetRange.vue'
//import './custom.css' // <-- Import your custom styling variables here!

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the component globally
    app.component('ImageFigure', ImageFigure)
    app.component('MoreInfo', MoreInfo)
    app.component('MicrobitDisplay', MicrobitDisplay)
    //app.component('Base26Encoder', Base26Encoder)
    //app.component('CharSetRange', CharSetRange)
  }
}
