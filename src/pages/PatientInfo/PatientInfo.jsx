import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getPatientData } from '../../actions/creator'
import { CHANGE_DOCTOR_PATIENT_DATA } from '../../constants/creator'

import QRCODE from '../../assets/qrcode.png'

import './PatientInfo.scss'

@connect(({ patientInfo }) => ({
  patientInfo
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getPatientData(id) {
    dispatch(getPatientData(id))
  }
}))

class PatientInfo extends Component {

  config = {
    navigationBarTitleText: '患者信息',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor() {
    super(...arguments)
  }

  componentWillMount() {
    const { params } = this.$router
    console.log(params)
    this.props.getPatientData(params.patientId)
  }

  handleChange(key, e) {
    console.log(e)
    this.props.action(CHANGE_DOCTOR_PATIENT_DATA, {
      [key]: e.detail.value
    })
  }

  toRemark() {
    const { params } = this.$router
    Taro.navigateTo({
      url: `/pages/Remark/Remark?patientId=${params.patientId}`
    })
  }

  saveChange() {
    const { relationId, follow, block, group } = this.props.patientInfo
    // 增加或移除关注分类
    if (follow && group.indexOf('3') === -1) {
      group.push('3')
    } else if (!follow && group.indexOf('3') > -1) {
      group.remove('3')
    }
    console.log(group)
    const relation = AV.Object.createWithoutData('DoctorPatientRelation', relationId)
    relation.set('follow', follow)
    relation.set('block', block)
    relation.set('group', group)
    relation.save().then(res => {
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
    const { patientInfo } = this.props
    return (
      <View className='detail'>
        <View className='title'>基本信息</View>
        <AtList>
          <AtListItem
            title='姓名'
            extraText={patientInfo.name}
          />
          <AtListItem
            title='性别'
            extraText={patientInfo.gender === 'M' ? '男' : '女'}
          />
          <AtListItem
            title='出生日期'
            extraText={patientInfo.birthday}
          />
          <AtListItem
            title='联系电话'
            extraText={patientInfo.phone}
          />
          <AtListItem
            title='所在城市'
            extraText={patientInfo.city}
          />
        </AtList>
        <View className='title'>基本特征</View>
        <AtList>
          <AtListItem
            title='身高'
            extraText={patientInfo.height}
          />
          <AtListItem
            title='体重'
            extraText={patientInfo.weight}
          />
        </AtList>
        <View className='title'></View>
        <AtList>
          <AtListItem
            title='是否关注'
            isSwitch
            switchColor='#3D79E5'
            switchIsCheck={patientInfo.follow}
            onSwitchChange={this.handleChange.bind(this, 'follow')}
          />
          <AtListItem
            title='屏蔽消息'
            isSwitch
            switchColor='#3D79E5'
            switchIsCheck={patientInfo.block}
            onSwitchChange={this.handleChange.bind(this, 'block')}
          />
        </AtList>
        <View class='btn'>
          <Button className='edit' onClick={this.toRemark.bind(this)}>编辑备注</Button>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
      </View>
    )
  }
}

export default PatientInfo
