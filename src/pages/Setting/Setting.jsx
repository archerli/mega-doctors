import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_SETTING } from '../../constants/creator'

import './Setting.scss'

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

class Setting extends Component {

  config = {
    navigationBarTitleText: '设置',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    this.props.getDoctorData()
    if (!Taro.getStorageSync('haveViewedSetting')) {
      Taro.setStorageSync('haveViewedSetting', true)
    }
  }

  toMpSetting() {
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
      }
    })
  }

  subscribeMessage() {
    // wx.getSetting({
    //   success (res) {
    //     console.log(res.authSetting)
    //   }
    // })
    Taro.requestSubscribeMessage({
      tmplIds: [
        '-ksZxv3e1ZSHPrMQ6ej4mNcH7Zkqmq9-BOynBevfI4o',
        'tJBMc1SOAcaWvVawKwHUMrIjoG6k1qG3VIHhZ6rSQ5Y'
      ],
      success(res) {
        console.log('success', res)
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          Taro.showModal({
            title: '提示',
            content: '· 如果您勾选过“总是保持以上选择，不再询问”，可以去“小程序设置->订阅消息”中管理微信通知。\r\n· 如果您未勾选“总是保持以上选择，不再询问”，可以再次点击开启按钮进行授权。',
            confirmText: '去设置',
            cancelText: '我知道了',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                })
              } else {
                console.log('cancel')
              }
            }
          })
        }
      },
      fail(err) {
        console.log('fail', err)
        if (err.errCode === 20004) {
          Taro.showModal({
            title: '提示',
            content: '小程序订阅消息开关未打开',
            confirmText: '去打开',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                })
              } else {
                console.log('cancel')
              }
            }
          })
        }
      }
    })
  }

  handleChange(key, e) {
    console.log(key)
    console.log(e.detail.value)
    if (key === 'normalConsultingPrice' || key === 'phoneConsultingPrice') {
      this.props.action(CHANGE_DOCTOR_SETTING, {
        [key]: Number(e.detail.value) + 10
      })
    } else {
      this.props.action(CHANGE_DOCTOR_SETTING, {
        [key]: e.detail.value
      })
    }
  }

  saveChange() {
    const { setting } = this.props
    const doctorid = Taro.getStorageSync('doctorid')
    const doctor = AV.Object.createWithoutData('Doctor', doctorid)
    doctor.set('startConsultation', setting.startConsultation)
    doctor.set('startConsultationTime', setting.startConsultationTime)
    doctor.set('endConsultationTime', setting.endConsultationTime)
    doctor.set('isNormalConsultingOpen', setting.isNormalConsultingOpen)
    doctor.set('isPhoneConsultingOpen', setting.isPhoneConsultingOpen)
    if (setting.isNormalConsultingOpen) doctor.set('normalConsultingPrice', setting.normalConsultingPrice)
    if (setting.isPhoneConsultingOpen) doctor.set('phoneConsultingPrice', setting.phoneConsultingPrice)
    doctor.save().then(res => {
      Taro.showToast({
        title: '保存成功'
      })
    }, err => {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    })
  }

  render () {
    const { setting } = this.props
    const priceArr = ['10元', '11元', '12元', '13元', '14元', '15元', '16元', '17元', '18元', '19元', '20元', '21元', '22元', '23元', '24元', '25元']
    return (
      <View className='setting'>
        <View className='title'>
          <AtList>
            <AtListItem
              title='开启咨询'
              isSwitch
              switchColor='#3D79E5'
              switchIsCheck={setting.startConsultation}
              onSwitchChange={this.handleChange.bind(this, 'startConsultation')}
            />
            <Picker
              mode='time'
              value={setting.startConsultationTime || '00:00'}
              onChange={this.handleChange.bind(this, 'startConsultationTime')}
            >
              <AtListItem
                title='开启时间'
                extraText={setting.startConsultationTime || '00:00'}
                arrow='right'
              />
            </Picker>
            <Picker
              mode='time'
              value={setting.endConsultationTime || '00:00'}
              onChange={this.handleChange.bind(this, 'endConsultationTime')}
            >
              <AtListItem
                title='结束时间'
                extraText={setting.endConsultationTime || '00:00'}
                arrow='right'
              />
            </Picker>
          </AtList>
        </View>
        <View className='group'>接受咨询方式</View>
        <View className='title'>
          <AtList>
            <AtListItem
              title='图文咨询'
              isSwitch
              switchColor='#3D79E5'
              switchIsCheck={setting.isNormalConsultingOpen}
              onSwitchChange={this.handleChange.bind(this, 'isNormalConsultingOpen')}
            />
            {
              setting.isNormalConsultingOpen &&
              <Picker
                mode='selector'
                range={priceArr}
                value={setting.normalConsultingPrice - 10}
                onChange={this.handleChange.bind(this, 'normalConsultingPrice')}
              >
                <AtListItem
                  title='您的报价'
                  extraText={priceArr[setting.normalConsultingPrice - 10]}
                  arrow='right'
                />
              </Picker>
            }
          </AtList>
        </View>
        <View className='title'>
          <AtList>
            <AtListItem
              title='电话咨询'
              isSwitch
              switchColor='#3D79E5'
              switchIsCheck={setting.isPhoneConsultingOpen}
              onSwitchChange={this.handleChange.bind(this, 'isPhoneConsultingOpen')}
            />
            {
              setting.isPhoneConsultingOpen &&
              <Picker
                mode='selector'
                range={priceArr}
                value={setting.phoneConsultingPrice - 10}
                onChange={this.handleChange.bind(this, 'phoneConsultingPrice')}
              >
                <AtListItem
                  title='您的报价'
                  extraText={priceArr[setting.phoneConsultingPrice - 10]}
                  arrow='right'
                />
              </Picker>
            }
          </AtList>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.subscribeMessage.bind(this)}>开启微信消息通知</Button>
          <View>· 开启后，我们才能通过微信通知您有新的消息。</View>
          <View>· 设置时请务必勾选“<Text style='color: #48AEFC'>总是保持以上选择，不再询问</Text>”。</View>
          <View>· 如果您勾选了该项目，您可以在“<Text style='color: #48AEFC; text-decoration: underline;' onClick={this.toMpSetting.bind(this)}>小程序设置->订阅消息</Text>”中管理具体通知。</View>
          <View>· 如果您不勾选该项目，通知为一次性。</View>
        </View>
      </View>
    )
  }
}

export default Setting
