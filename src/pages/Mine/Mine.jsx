import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtIcon } from "taro-ui"

import { getDoctorData } from '../../actions/creator'

import AUTH from '../../assets/auth.png'
import INVITE from '../../assets/invite.png'
import SERVICE from '../../assets/service.png'
import AG from '../../assets/ag.png'
import SETTING from '../../assets/setting.png'

import './Mine.scss'

@connect(({ mine }) => ({
  mine
}), (dispatch) => ({
  getDoctorData() {
    dispatch(getDoctorData())
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
    this.props.getDoctorData();
  }

  toDoctorAuth() {
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
    Taro.navigateTo({
      url: '/pages/QRCode/QRCode'
    })
  }

  dosth() {
    Taro.requestSubscribeMessage({
      tmplIds: ['W9nQspoCWnRGH1Qu5x0TjD9T6kzh31UeIviwUQLLU9s'],
      success (res) { }
    })
  }

  render () {
    const { mine } = this.props
    return (
      <View className='mine'>
        <View className='info'>
          <View className='info-1'>
            <AtAvatar circle image='https://jdc.jd.com/img/200'></AtAvatar>
          </View>
          <View className='info-2'>
            <View className='name'>
              <Text>{mine.name}</Text>
              <Image src={AUTH} onClick={this.toDoctorAuth.bind(this)} />
            </View>
            <View>兆观号：10115</View>
          </View>
          <View className='info-3' onClick={this.toMyInfo.bind(this)}>
            <AtIcon value='chevron-right' size='28' color='#999999'></AtIcon>
          </View>
        </View>
        <View className='data'>
          <View>
            <Text>{mine.authenticated}</Text>
            <Text className='data-i'>咨询量</Text>
          </View>
          <View>
            <Text>100</Text>
            <Text className='data-i'>我的患者</Text>
          </View>
          <View>
            <Text>300</Text>
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
              extraText='克里斯'
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
            />
          </AtList>
        </View>
        <Button onClick={this.dosth.bind(this)}>TEST</Button>
      </View>
    )
  }
}

export default Mine
