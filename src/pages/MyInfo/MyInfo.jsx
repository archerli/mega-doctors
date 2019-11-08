import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtFloatLayout } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { getDoctorData, changeDoctorData } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './MyInfo.scss'

@connect(({ myInfo }) => ({
  myInfo
}), (dispatch) => ({
  getDoctorData(doctorid) {
    dispatch(getDoctorData(doctorid))
  },
  changeDoctorData(data) {
    dispatch(changeDoctorData(data))
  }
}))

class MyInfo extends Component {

  config = {
    navigationBarTitleText: '个人信息',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
  }

  componentDidMount() {
    const doctorid = Taro.getStorageSync('doctorid')
    this.props.getDoctorData(doctorid)
  }

  componentWillUnmount() {
    this.props.changeDoctorData({
      isOpened: false,
      placeholder: '',
      value: '',
    })
  }

  toRemark() {
    Taro.navigateTo({
      url: '/pages/Remark/Remark'
    })
  }

  handleChange(key, range, e) {
    console.log(e)
    console.log(key)
    console.log(range)
    this.props.changeDoctorData({
      [key]: range[e.detail.value]
    })
  }

  handleChange2(key, e) {
    console.log(e)
    console.log(key)
    const _keyList = ['姓名', '所在医院', '所在科室', '电话']
    const keyList = ['name', 'hospital', 'department', 'phone']
    key = keyList[_keyList.indexOf(key)]
    console.log(key)
    this.props.changeDoctorData({
      [key]: e.detail.value,
      isOpened: false,
      placeholder: '',
      value: ''
    })
  }

  edit(placeholder, value) {
    this.props.changeDoctorData({
      isOpened: true,
      placeholder,
      value,
      focus: true
    })
  }

  saveChange() {
    const { myInfo } = this.props
    console.log(myInfo)
    const doctorid = Taro.getStorageSync('doctorid')
    const doctor = AV.Object.createWithoutData('Doctor', doctorid);
    doctor.set('name', myInfo.name);
    doctor.set('gender', myInfo.gender);
    doctor.set('hospital', myInfo.hospital);
    doctor.set('department', myInfo.department);
    doctor.set('title', myInfo.title);
    doctor.set('phone', myInfo.phone);
    doctor.save().then(res => {
      Taro.showToast({
        title: '保存成功'
      })
    }, err => {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    });
  }

  render () {
    const { myInfo } = this.props
    const userInfo = Taro.getStorageSync('userInfo')
    const genderRange = ['男', '女']
    const titleRange = ['主任医师', '副主任医师', '主治医师', '住院医师']
    
    return (
      <View className='myinfo'>
        <View className='icon'>
          <AtList>
            <AtListItem
              title='工作照'
              extraThumb={userInfo.avatarUrl}
              arrow='right'
            />
          </AtList>
        </View>
        <View>
          <AtList>
            <AtListItem
              title='姓名'
              extraText={myInfo.name}
              arrow='right'
              onClick={this.edit.bind(this, '姓名', myInfo.name)}
            />
            <Picker mode='selector' range={genderRange} onChange={this.handleChange.bind(this, 'gender', ['M', 'F'])}>
              <AtListItem
                title='性别'
                extraText={myInfo.gender === 'M' ? '男' : '女'}
                arrow='right'
              />
            </Picker>
            <AtListItem
              title='所在医院'
              extraText={myInfo.hospital}
              arrow='right'
              onClick={this.edit.bind(this, '所在医院', myInfo.hospital)}
            />
            <AtListItem
              title='所在科室'
              extraText={myInfo.department}
              arrow='right'
              onClick={this.edit.bind(this, '所在科室', myInfo.department)}
            />
            <Picker mode='selector' range={titleRange} onChange={this.handleChange.bind(this, 'title', titleRange)}>
              <AtListItem
                title='职称'
                extraText={myInfo.title}
                arrow='right'
              />
            </Picker>
            <AtListItem
              title='电话'
              extraText={myInfo.phone}
              arrow='right'
              onClick={this.edit.bind(this, '电话', myInfo.phone)}
            />
          </AtList>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
        <AtFloatLayout isOpened={myInfo.isOpened}>
          {
            myInfo.isOpened &&
            <Input
              className='edit'
              // type={myInfo.placeholder === '电话' ? 'number': 'text'}
              placeholder={myInfo.placeholder}
              value={myInfo.value}
              adjustPosition={false}
              focus
              onConfirm={this.handleChange2.bind(this, myInfo.placeholder)}
            />
          }
        </AtFloatLayout>
      </View>
    )
  }
}

export default MyInfo
