import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { getPatientData } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './PatientInfo.scss'

@connect(({ patientInfo }) => ({
  patientInfo
}), (dispatch) => ({
  getPatientData (id) {
    dispatch(getPatientData(id))
  }
}))

class PatientInfo extends Component {

  config = {
    navigationBarTitleText: '患者信息',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {
      isOpened: false,
    }
  }

  componentWillMount() {
    const params = this.$router.params
    console.log(params)
    this.props.getPatientData(params.patientId);
  }

  handleChange () {
    this.setState({
      isOpened: true
    })
  }

  onClose () {
    this.setState({
      isOpened: false
    })
  }

  toRemark() {
    Taro.navigateTo({
      url: '/pages/Remark/Remark'
    })
  }

  render () {
    return (
      <View className='detail'>
        <View className='title'>基本信息</View>
        <AtList>
          <AtListItem
            title='姓名'
            extraText='王大锤'
          />
          <AtListItem
            title='性别'
            extraText='男'
          />
          <AtListItem
            title='出生日期'
            extraText='1900-01-01'
          />
          <AtListItem
            title='联系电话'
            extraText='18866667777'
          />
          <AtListItem
            title='所在城市'
            extraText='杭州市'
          />
        </AtList>
        <View className='title'>基本特征</View>
        <AtList>
          <AtListItem
            title='身高'
            extraText='186cm'
          />
          <AtListItem
            title='体重'
            extraText='76kg'
          />
        </AtList>
        <View className='title'></View>
        <AtList>
          <AtListItem
            title='是否关注'
            isSwitch
            switchColor='#3D79E5'
            onSwitchChange={this.handleChange.bind(this)}
          />
          <AtListItem
            title='屏蔽消息'
            isSwitch
            switchColor='#3D79E5'
            onSwitchChange={this.handleChange.bind(this)}
          />
        </AtList>
        <View class='btn'>
          <Button className='edit' onClick={this.toRemark.bind(this)}>编辑备注</Button>
          <Button className='save'>保存</Button>
        </View>
      </View>
    )
  }
}

export default PatientInfo
