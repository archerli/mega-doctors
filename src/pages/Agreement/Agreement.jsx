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
    this.state = {
      showAgreement3: false
    }
  }

  componentWillMount() {
    const { params } = this.$router
    console.log(params)
    if (params.authenticated === '1') {
      this.setState({
        showAgreement3: true
      })
    }
  }

  toAgreement1() {
    const url = 'https://megahealth.cn/mega-doctor-ag/DoctorCooperationAgreement.html'
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

  toAgreement3() {
    const url = 'https://megahealth.cn/mega-doctor-ag/DoctorFeeSettlement.html'
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
              title='医生合作协议'
              arrow='right'
              thumb={AG}
              onClick={this.toAgreement1.bind(this)}
            />
            <AtListItem
              title='兆观隐私协议'
              arrow='right'
              thumb={AG}
              onClick={this.toAgreement2.bind(this)}
            />
            {
              this.state.showAgreement3 &&
              <AtListItem
                title='医生结算协议'
                arrow='right'
                thumb={AG}
                onClick={this.toAgreement3.bind(this)}
              />
            }
          </AtList>
        </View>
      </View>
    )
  }
}

export default Agreement
