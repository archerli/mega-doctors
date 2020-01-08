import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/creator'

import './Webview.scss'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))

class Webview extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    // navigationStyle: 'custom'
  }

  constructor() {
    super(...arguments)
    this.state = {
      url: ''
    }
  }

  componentWillMount () {
    const { params } = this.$router
    console.log(params.url)
    if (params && params.url) {
      this.setState({
        url: params.url
      })
    }
  }

  onShareAppMessage() {
    const { params } = this.$router
    console.log(params.url)
    const url = params.url
    return {
      title: params.name ? `查看用户${params.name}的睡眠报告` : '',
      path: `/pages/Webview/Webview?url=${url.indexOf('?') > -1 ? encodeURIComponent(url) : url}&name=${params.name || ''}`,
      success: function () { },
      fail: function () { }
    }
  }

  load() {
    Taro.setNavigationBarTitle({
      title: ''
    })
  }

  render () {
    const { url } = this.state;
    return (
      <WebView src={decodeURIComponent(url)} onLoad={this.load.bind(this)} />
    )
  }
}

export default Webview
