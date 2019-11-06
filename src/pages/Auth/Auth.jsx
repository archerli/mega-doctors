import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './Auth.scss'

class Auth extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {
      haveUserInfo: false
    }
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    const havePhoneNumber = Taro.getStorageSync('havePhoneNumber')
    console.log(userInfo)
    console.log(havePhoneNumber)
    if (userInfo && !havePhoneNumber) {
      this.setState({
        haveUserInfo: true
      })
    } else if (userInfo && havePhoneNumber) {
      Taro.reLaunch({
        url: '../Index/Index'
      })
    }
  }

  login() {
    Taro.login({
      success(res) {
        if (res.code) {
          Taro.request({
            url: 'https://wxapi.zangtengfei.com/onLogin',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res.data)
              Taro.setStorageSync('openid', res.data.openid)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.login();
      Taro.setStorageSync('userInfo', e.detail.userInfo)
      this.setState({
        haveUserInfo: true
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '微信登录需要获取您的用户信息，请点击授权',
        showCancel: false,
        confirmColor: '#003390'
      });
    }
  }

  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      Taro.setStorageSync('havePhoneNumber', true)
      Taro.reLaunch({
        url: '../Index/Index'
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '微信登录需要获取您的手机号，请点击授权',
        showCancel: false,
        confirmColor: '#003390'
      });
    }
  }

  render () {
    return (
      <View className='auth'>
        <View className='title'>兆观健康医生端</View>
        <View class='btn'>
          {
            this.state.haveUserInfo
            ? <Button className='login' open-type='getPhoneNumber' onGetPhoneNumber={this.getPhoneNumber.bind(this)}>微信登录</Button>
            : <Button className='auth' open-type='getUserInfo' onGetUserInfo={this.getUserInfo.bind(this)}>微信授权用户信息</Button>
          }
        </View>
      </View>
    )
  }
}

export default Auth
