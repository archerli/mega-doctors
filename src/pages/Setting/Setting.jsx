import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { getPatientData, changeDoctorPatientData } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './Setting.scss'

@connect(({ patientInfo }) => ({
  patientInfo
}), (dispatch) => ({

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

  }

  handleChange(key, e) {
    console.log(e)
    this.props.changeDoctorPatientData({
      [key]: e.detail.value
    })
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

  saveChange() {
    // const { follow, block } = this.props.patientInfo
    // const relation = AV.Object.createWithoutData('DoctorPatientRelation', '5db80167eaa375006c18a14c');
    // relation.set('follow', follow);
    // relation.set('block', block);
    // relation.save().then(res => {
    //   Taro.showToast({
    //     title: '保存成功'
    //   })
    // }, err => {
    //   Taro.showToast({
    //     title: '保存失败，请重试',
    //     icon: 'none'
    //   })
    // });
  }

  render () {
    const { patientInfo } = this.props
    return (
      <View className='setting'>
        <View className='title'>
          <AtList>
            <AtListItem
              title='开启咨询'
              isSwitch
              switchColor='#3D79E5'
              switchIsCheck={patientInfo.block}
              onSwitchChange={this.handleChange.bind(this, 'block')}
            />
            <AtListItem
              title='开启时间'
              extraText={'11:00'}
            />
            <AtListItem
              title='结束时间'
              extraText={'20:00'}
            />
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
