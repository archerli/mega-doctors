import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import LOGO from '../../assets/mega-logo.png'

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
              const openid = res.data.openid
              Taro.setStorageSync('openid', openid)
              // 查询医生用户，已有
              var query = new AV.Query('Doctor')
              query.equalTo('openid', openid)
              query.find().then(res => {
                console.log(res)
                if (res.length) {
                  Taro.setStorageSync('doctorid', res[0].id)
                } else {
                  const Doctor = AV.Object.extend('Doctor')
                  const doctor = new Doctor()
                  doctor.set('openid', openid)
                  doctor.set('authenticated', '1')
                  doctor.save().then(d => {
                    Taro.setStorageSync('doctorid', d.id)
                  })
                }
              })
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
        // confirmColor: '#1AAD19'
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
      Taro.reLaunch({
        url: '../Index/Index'
      })
      // Taro.showModal({
      //   title: '提示',
      //   content: '微信登录需要获取您的手机号，请点击授权',
      //   showCancel: false,
      //   confirmColor: '#1AAD19'
      // });
    }
  }

  render () {
    return (
      <View className='auth'>
        <View className='logo'>
          <Image src={LOGO} />
        </View>
        <View className='title'>兆观健康医生端</View>
        <View class='btn'>
          {
            this.state.haveUserInfo
            ? <Button className='login' open-type='getPhoneNumber' onGetPhoneNumber={this.getPhoneNumber.bind(this)}>微信登录</Button>
            : <Button className='auth' open-type='getUserInfo' onGetUserInfo={this.getUserInfo.bind(this)}>微信授权用户信息</Button>
          }
        </View>
        <View className='ag'>
          登录视为您同意《
          <Text>用户协议</Text>
          》和《
          <Text>隐私条款</Text>
          》
        </View>
      </View>
    )
  }
}

export default Auth
