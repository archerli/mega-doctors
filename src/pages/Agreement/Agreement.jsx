import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_SETTING } from '../../constants/creator'

import AG from '../../assets/ag.png'

import './Agreement.scss'

@connect(({ setting }) => ({
  setting
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getDoctorData() {
    dispatch(getDoctorData())
  }
}))

class Agreement extends Component {

  config = {
    navigationBarTitleText: '使用协议',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor() {
    super(...arguments)
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
      <View className='agreement'>
        <View className='list'>
          <AtList>
            <AtListItem
              title='兆观医生协议'
              arrow='right'
              thumb={AG}
              onClick={this.toAgreement1.bind(this)}
            />
            <AtListItem
              title='兆观隐私政策'
              arrow='right'
              thumb={AG}
              onClick={this.toAgreement2.bind(this)}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

export default Agreement
