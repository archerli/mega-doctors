import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import WeCropper from '../we-cropper/we-cropper.js'

import './Avatar.scss'

class Avatar extends Component {

  config = {
    // navigationBarBackgroundColor: "#000000",
    navigationBarTitleText: '更换头像',
    disableScroll: true,
    backgroundColor: "#ffffff"
  }

  constructor () {
    super(...arguments)
    this.state = { 
      avatarUrl: ''
    }
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    this.setState({
      avatarUrl: userInfo.avatarUrl
    })
  }

  chooseImage() {
    Taro.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setState({
          avatarUrl: tempFilePaths
        })
      }
    })
  }

  render () {
    const { avatarUrl } = this.state
    return (
      <View className='avatar'>
        <Image mode='widthFix' src={avatarUrl} onClick={this.chooseImage.bind(this)} />
      </View>
    )
  }
}

export default Avatar
