import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtIcon } from "taro-ui"

import { getDoctorData, getConsultationNum, getDoctorPatientNumAndCredit } from '../../actions/creator'

import AUTH_0 from '../../assets/auth-0.png'
import AUTH_1 from '../../assets/auth-1.png'
import AUTH_2 from '../../assets/auth-2.png'
import INVITE from '../../assets/invite.png'
import SERVICE from '../../assets/service.png'
import AG from '../../assets/ag.png'
import SETTING from '../../assets/setting.png'
import AVATAR_D from '../../assets/avatar-d.png'

import './Mine.scss'

@connect(({ mine }) => ({
  mine
}), (dispatch) => ({
  getDoctorData() {
    dispatch(getDoctorData())
  },
  getConsultationNum() {
    dispatch(getConsultationNum())
  },
  getDoctorPatientNumAndCredit() {
    dispatch(getDoctorPatientNumAndCredit())
  }
}))

class Mine extends Component {

  config = {
    navigationBarTitleText: '我的',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {

    }
  }

  componentDidMount() {
    // const doctorid = Taro.getStorageSync('doctorid')
    this.props.getDoctorData()
    this.props.getConsultationNum()
    this.props.getDoctorPatientNumAndCredit()
    const haveTappedMineTab = Taro.getStorageSync('haveTappedMineTab')
    if (!haveTappedMineTab) {
      Taro.setStorageSync('haveTappedMineTab', true)
    }
  }

  // 切换tab时刷新页面
  onTabItemTap() {
    console.log('onTabItemTap')
    const haveTappedMineTab = Taro.getStorageSync('haveTappedMineTab')
    if (haveTappedMineTab) {
      this.props.getDoctorData()
      this.props.getConsultationNum()
      this.props.getDoctorPatientNumAndCredit()
    }
  }

  toDoctorAuth() {
    const { mine } = this.props
    if (!mine.name) {
      return Taro.showToast({
        title: '请先完善个人资料',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: '/pages/DoctorAuth/DoctorAuth'
    })
  }

  toMyInfo() {
    Taro.navigateTo({
      url: '/pages/MyInfo/MyInfo'
    })
  }

  toQRCode() {
    const { mine } = this.props
    if (!mine.name) {
      return Taro.showToast({
        title: '请先完善个人资料',
        icon: 'none'
      })
    }
    if (mine.authenticated !== '1') {
      return Taro.showToast({
        title: '请先通过认证哦',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: '/pages/QRCode/QRCode'
    })
  }

  toSetting() {
    Taro.navigateTo({
      url: '/pages/Setting/Setting'
    })
  }

  render () {
    const { mine } = this.props
    return (
      <View className='mine'>
        <View className='info'>
          <View className='info-1' onClick={this.toMyInfo.bind(this)}>
            <AtAvatar circle image={mine.avatar || AVATAR_D}></AtAvatar>
          </View>
          <View className='info-2'>
            <View className='name'>
              <Text onClick={this.toMyInfo.bind(this)}>{mine.name || '请完善资料'}</Text>
              {
                mine.authenticated === '0'
                ? <Image src={AUTH_0} onClick={this.toDoctorAuth.bind(this)} />
                : (
                  mine.authenticated === '1'
                  ? <Image src={AUTH_1} onClick={this.toDoctorAuth.bind(this)} />
                  : <Image src={AUTH_2} onClick={this.toDoctorAuth.bind(this)} />
                )
              }
            </View>
            <View>兆观号：{mine.megaId}</View>
          </View>
          <View className='info-3' onClick={this.toMyInfo.bind(this)}>
            <AtIcon value='chevron-right' size='28' color='#999999'></AtIcon>
          </View>
        </View>
        <View className='data'>
          <View>
            <Text>{mine.consultationNum}</Text>
            <Text className='data-i'>咨询量</Text>
          </View>
          <View>
            <Text>{mine.patientNum}</Text>
            <Text className='data-i'>我的患者</Text>
          </View>
          <View>
            <Text>{mine.credit}</Text>
            <Text className='data-i'>我的积分</Text>
          </View>
        </View>
        <View className='list'>
          <AtList style='margin-bottom: 20px;'>
            <AtListItem
              title='邀请患者'
              arrow='right'
              thumb={INVITE}
              onClick={this.toQRCode.bind(this)}
            />
            <AtListItem
              title='我的兆观助手'
              extraText=''
              arrow='right'
              thumb={SERVICE}
            />
          </AtList>
        </View>
        <View className='list'>
          <AtList>
            <AtListItem
              title='使用协议'
              arrow='right'
              thumb={AG}
            />
            <AtListItem
              title='设置'
              arrow='right'
              thumb={SETTING}
              onClick={this.toSetting.bind(this)}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

export default Mine
