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
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      url: ''
    }
  }

  componentWillMount () {
    console.log(this.$router.params)
    const params = this.$router.params;
    if (params && params.url) {
      this.setState({
        url: this.$router.params.url
      })
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
