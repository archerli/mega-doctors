import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_SETTING } from '../../constants/creator'
import QRCODE from '../../assets/qrcode.png'

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

  componentWillMount() {
    this.props.getDoctorData()
  }

  subscribeMessage() {
    Taro.requestSubscribeMessage({
      tmplIds: [
        '-ksZxv3e1ZSHPrMQ6ej4mNcH7Zkqmq9-BOynBevfI4o',
        'tJBMc1SOAcaWvVawKwHUMrIjoG6k1qG3VIHhZ6rSQ5Y'
      ],
      success (res) { }
    })
  }

  handleChange(key, e) {
    console.log(key)
    console.log(e.detail.value)
    this.props.action(CHANGE_DOCTOR_SETTING, {
      [key]: e.detail.value
    })
  }

  saveChange() {
    const { setting } = this.props
    const doctorid = Taro.getStorageSync('doctorid')
    const doctor = AV.Object.createWithoutData('Doctor', doctorid)
    doctor.set('startConsultation', setting.startConsultation)
    doctor.set('startConsultationTime', setting.startConsultationTime)
    doctor.set('endConsultationTime', setting.endConsultationTime)
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
        <View class='btn'>
          <Button className='save' onClick={this.subscribeMessage.bind(this)}>开启微信消息通知</Button>
          <View>开启后，我们才能通过微信通知您有新的消息。</View>
          <View>请选择“总是保持以上选择，不再询问”；若要关闭可点右上角进行操作。</View>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
      </View>
    )
  }
}

export default Setting
