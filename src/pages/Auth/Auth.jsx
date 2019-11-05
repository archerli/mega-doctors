import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/creator'

import './Auth.scss'

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

class Auth extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {

    }
  }

  componentDidMount() {
    Taro.getStorage({
      key: 'userInfo',
      success: res => {
        console.log(res)
        Taro.reLaunch({
          url: '../Index/Index'
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }

  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      Taro.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: () => {
          Taro.reLaunch({
            url: '../Index/Index'
          })
        }
      })
      console.log('userInfo: ', e.detail)
    } else {
      Taro.showModal({
        title: '',
        content: '微信登录需要获取您的用户信息，请点击授权',
        showCancel: false,
        confirmColor: '#003390'
      });
    }
  }

  getPhoneNumber(e) {
    console.log(e)
  }

  render () {
    return (
      <View className='auth'>
        <View className='title'>兆观健康医生端</View>
        <View class='btn'>
          <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo.bind(this)}>微信授权用户信息</Button>
          <Button open-type='getPhoneNumber' onGetPhoneNumber={this.getPhoneNumber.bind(this)}>微信登录</Button>
        </View>
      </View>
    )
  }
}

export default Auth
