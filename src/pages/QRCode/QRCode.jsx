import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './QRCode.scss'

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

class QRCode extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {
      isOpened: false,
    }
  }

  handleChange () {
    this.setState({
      isOpened: true
    })
  }

  onClose () {
    this.setState({
      isOpened: false
    })
  }

  toRemark() {
    Taro.navigateTo({
      url: '/pages/Remark/Remark'
    })
  }

  render () {
    return (
      <View className='qrcode'>
        <View className='doc-tip'>让患者打开微信扫一扫</View>
        <View className='doc-tip'>关注我</View>
        <View className='qrc-img'>
          <Image src={QRCODE} />
        </View>
        <View className='pat-tip'>打开微信扫一扫关注王医生</View>
        <View className='doc-tip'>扫码不会透露我的微信号或手机号</View>
        <View className='btn'>把二维码添加到桌面</View>
      </View>
    )
  }
}

export default QRCode
