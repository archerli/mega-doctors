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

Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/Index/Index',
      'pages/Patient/Patient',
      'pages/Question/Question',
      'pages/Remark/Remark',
      'pages/Mine/Mine',
      'pages/Webview/Webview',
      'pages/PatientInfo/PatientInfo',
      'pages/MyInfo/MyInfo',
      'pages/Avatar/Avatar',
      'pages/DoctorAuth/DoctorAuth',
      'pages/QRCode/QRCode',
      'pages/Auth/Auth',
      'pages/Setting/Setting',
      'pages/ReportList/ReportList',
      'pages/Service/Service',
      'pages/Agreement/Agreement'
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
          "pagePath": "pages/Index/Index",
          "text": "咨询",
          "iconPath": "assets/index.png",
          "selectedIconPath": "assets/index-s.png"
        },
        {
          "pagePath": "pages/Patient/Patient",
          "text": "患者",
          "iconPath": "assets/user.png",
          "selectedIconPath": "assets/user-s.png"
        },
        {
          "pagePath": "pages/Mine/Mine",
          "text": "我的",
          "iconPath": "assets/mine.png",
          "selectedIconPath": "assets/mine-s.png"
        }
      ]
    }
  }

  componentDidMount () {
    utils.initAV('f82OcAshk5Q1J993fGLJ4bbs-gzGzoHsz', 'O9COJzi78yYXCWVWMkLqlpp8');
    Taro.setStorageSync('haveTappedIndexTab', false)
    Taro.setStorageSync('haveTappedPatientTab', false)
    Taro.setStorageSync('haveTappedMineTab', false)

    // 版本更新
    setTimeout(() => {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
      })

      updateManager.onUpdateReady(() => {
        Taro.showModal({
          title: '升级提示',
          content: '新版本已经准备好了，现在就体验吧',
          showCancel: false,
          confirmText: '开始升级',
          success: res => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      })

      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        Taro.showModal({
          title: '升级提示',
          content: '新版本升级失败',
          showCancel: false
        })
      })
    }, 6000);

  }

  componentDidShow () {
    // console.log('onShow', Taro.getStorageSync('onShow'))
    // Taro.setStorageSync('onShow', 1);
  }

  componentDidHide () {
    // console.log('onHide', Taro.getStorageSync('onHide'))
    // Taro.setStorageSync('onHide', 1);
  }

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
