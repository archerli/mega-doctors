import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import utils from './common/utils'
import Index from './pages/index'

import configStore from './store'

import './app.scss'
import 'taro-ui/dist/style/index.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/patient/patient',
      'pages/question/question',
      'pages/remark/remark',
      'pages/mine/mine',
      'pages/webview/webview'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666666",
      selectedColor: "#000000",
      backgroundColor: "#fff",
      list: [
        {
          "pagePath": "pages/index/index",
          "text": "咨询",
          "iconPath": "assets/index.png",
          "selectedIconPath": "assets/index-s.png"
        },
        {
          "pagePath": "pages/patient/patient",
          "text": "患者",
          "iconPath": "assets/user.png",
          "selectedIconPath": "assets/user-s.png"
        },
        {
          "pagePath": "pages/mine/mine",
          "text": "我的",
          "iconPath": "assets/mine.png",
          "selectedIconPath": "assets/mine-s.png"
        }
      ]
    },
  }

  componentDidMount () {
    utils.initAV('f82OcAshk5Q1J993fGLJ4bbs-gzGzoHsz', 'O9COJzi78yYXCWVWMkLqlpp8');
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
