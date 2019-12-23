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
    wx.cloud.init()
  }

  login(phoneNumber) {
    return new Promise((resolve, reject) => {
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
                    resolve()
                  } else {
                    const Doctor = AV.Object.extend('Doctor')
                    const doctor = new Doctor()
                    doctor.set('openid', openid)
                    doctor.set('authenticated', '0')
                    if (phoneNumber) doctor.set('phone', phoneNumber)
                    doctor.save().then(d => {
                      Taro.setStorageSync('doctorid', d.id)
                      resolve()
                    }, err => {
                      reject(err)
                    })
                  }
                }, err => {
                  reject(err)
                })
              },
              fail(err) {
                reject(err)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res)
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
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

  async getPhoneNumber(e) {
    Taro.showLoading({
      title: '登录中...',
      mask: true
    })
    try {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        const cloudID = e.detail.cloudID
        const res = await wx.cloud.callFunction({
          name: 'login',
          data: {
            phoneData: wx.cloud.CloudID(cloudID)
          }
        })
        const phoneData = res.result.event && res.result.event.phoneData
        const phoneNumber = phoneData && phoneData.data && phoneData.data.phoneNumber
        console.log(phoneNumber);
        Taro.setStorageSync('havePhoneNumber', true)
        await this.login(phoneNumber)
        Taro.hideLoading()
        Taro.reLaunch({
          url: '../Index/Index'
        })
      } else {
        await this.login()
        Taro.hideLoading()
        Taro.reLaunch({
          url: '../Index/Index'
        })
      }
    } catch(e) {
      Taro.hideLoading()
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }

  toAgreement1() {
    const url = 'https://megahealth.cn/mega-doctor-ag/DoctorAgreements.html'
    Taro.navigateTo({
      url: `/pages/Webview/Webview?url=${encodeURIComponent(url)}`
    })
  }

  toAgreement2() {
    const url = 'https://megahealth.cn/mega-doctor-ag/PrivacyPrivacy.html'
    Taro.navigateTo({
      url: `/pages/Webview/Webview?url=${encodeURIComponent(url)}`
    })
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
          <Text onClick={this.toAgreement1.bind(this)}>用户协议</Text>
          》和《
          <Text onClick={this.toAgreement2.bind(this)}>隐私条款</Text>
          》
        </View>
      </View>
    )
  }
}

export default Auth
