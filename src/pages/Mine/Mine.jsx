import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Switch } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtIcon } from "taro-ui"

import { getDoctorData, getConsultationNum, getDoctorPatientNumAndCredit } from '../../actions/creator'

import AUTH_0 from '../../assets/auth-0.png'
import AUTH_1 from '../../assets/auth-1.png'
import AUTH_2 from '../../assets/auth-2.png'
import AUTH_3 from '../../assets/auth-3.png'
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
      haveDoctorId: true
    }
  }

  componentDidMount() {
    const doctorid = Taro.getStorageSync('doctorid')
    if (!doctorid) {
      this.setState({
        haveDoctorId: false
      })
    } else {
      this.props.getDoctorData()
      this.props.getConsultationNum()
      this.props.getDoctorPatientNumAndCredit()
      const haveTappedMineTab = Taro.getStorageSync('haveTappedMineTab')
      if (!haveTappedMineTab) {
        Taro.setStorageSync('haveTappedMineTab', true)
      }
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

  toAuth() {
    Taro.navigateTo({
      url: '/pages/Auth/Auth'
    })
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
    const doctorid = Taro.getStorageSync('doctorid')
    if (!doctorid) {
      return Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: '/pages/MyInfo/MyInfo'
    })
  }

  toQRCode() {
    const { mine } = this.props
    const doctorid = Taro.getStorageSync('doctorid')
    if (!doctorid) {
      return Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
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
      url: `/pages/QRCode/QRCode?doctorid=${doctorid}`
    })
  }

  toSetting() {
    const doctorid = Taro.getStorageSync('doctorid')
    if (!doctorid) {
      return Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: '/pages/Setting/Setting'
    })
  }

  toService() {
    const doctorid = Taro.getStorageSync('doctorid')
    if (!doctorid) {
      return Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: '/pages/Service/Service'
    })
  }

  toAgreement() {
    const { mine } = this.props
    Taro.navigateTo({
      url: `/pages/Agreement/Agreement?authenticated=${mine.authenticated}`
    })
  }

  render () {
    const { mine } = this.props
    const { haveDoctorId } = this.state
    let authenticatedIcon = ''
    switch(mine.authenticated) {
      case '0':
        authenticatedIcon = AUTH_0
        break
      case '1':
        authenticatedIcon = AUTH_1
        break
      case '2':
        authenticatedIcon = AUTH_2
        break
      case '3':
        authenticatedIcon = AUTH_3
        break
      default:
        break
    }
    return (
      <View className='mine'>
        <View className='info'>
          <View className='info-1' onClick={this.toMyInfo.bind(this)}>
            <AtAvatar circle image={mine.avatar || AVATAR_D}></AtAvatar>
          </View>
          {
            haveDoctorId
            ? <View className='info-2'>
              <View className='name'>
                <Text onClick={this.toMyInfo.bind(this)}>{mine.name || '请完善资料'}</Text>
                <Image src={authenticatedIcon} onClick={this.toDoctorAuth.bind(this)} />
              </View>
              <View>兆观号：{mine.megaId}</View>
            </View>
            : <View className='info-2'>
              <View className='name'>
                <Text onClick={this.toAuth.bind(this)}>点击登录账户</Text>
              </View>
            </View>
          }
          {
            haveDoctorId &&
            <View className='info-3' onClick={this.toMyInfo.bind(this)}>
              <AtIcon value='chevron-right' size='28' color='#999999'></AtIcon>
            </View>
          }
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
              extraText={mine.haveNewServiceMessage ? '●' : ''}
              onClick={this.toService.bind(this)}
            />
          </AtList>
        </View>
        <View className='list'>
          <AtList>
            <AtListItem
              title='使用协议'
              arrow='right'
              thumb={AG}
              onClick={this.toAgreement.bind(this)}
            />
            <AtListItem
              title='设置'
              arrow='right'
              thumb={SETTING}
              onClick={this.toSetting.bind(this)}
            />
          </AtList>
        </View>
        <View className='version'>版本号 1.1.5</View>
      </View>
    )
  }
}

export default Mine
