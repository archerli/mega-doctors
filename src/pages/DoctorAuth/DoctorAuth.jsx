import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './DoctorAuth.scss'

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

class DoctorAuth extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
  }

  previewImage(urls) {
    Taro.previewImage({
      urls
    })
  }

  render () {
    const zg = 'https://6d65-mega-hzh-1258406532.tcb.qcloud.la/cydemo.jpg?sign=bbe3295f257bc7bae7f3ba1e885f45a4&t=1573192673'
    const zy = 'https://6d65-mega-hzh-1258406532.tcb.qcloud.la/zjdemo.jpg?sign=5cb6336c69c209d017fea1dbd5d495e6&t=1573192687'
    return (
      <View className='docauth'>
        <View className='tip-1'>认证后会有认证标识，获得更多咨询机会与收益</View>
        <View className='tip-2'>
          <View className='tip-2-t'>上传您的资格证或执业证</View>
          <View className='tip-2-c'>* 请确保姓名、照片、编号、发证机关清晰可见。</View>
          <View className='tip-2-c'>* 上传的资料仅用于认证时使用，患者及第三方均不可见。</View>
        </View>
        <View className='licence'>医师资格证</View>
        <View className='licence-img'>
          <Image
            mode='aspectFill'
            src={zg}
            onClick={this.previewImage.bind(this, [zg])}
          />
          <View onClick={this.previewImage.bind(this, [zg])}>点击预览</View>
        </View>
        <View className='licence'>医生执业证</View>
        <View className='licence-img'>
          <Image
            mode='aspectFill'
            src={zy}
            onClick={this.previewImage.bind(this, [zy])}
          />
          <View onClick={this.previewImage.bind(this, [zy])}>点击预览</View>
        </View>
        <View className='tip-3'>可联系助手，提供资料让助手进行认证</View>
        <View class='btn'>
          <Button className='save'>提交</Button>
        </View>
      </View>
    )
  }
}

export default DoctorAuth
