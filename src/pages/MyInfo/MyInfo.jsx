import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtFloatLayout } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_DATA, CHANGE_DOCTOR_NAME } from '../../constants/creator'

import './MyInfo.scss'

@connect(({ myInfo }) => ({
  myInfo
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getDoctorData() {
    dispatch(getDoctorData())
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
    // const doctorid = Taro.getStorageSync('doctorid')
    this.props.getDoctorData()
  }

  componentWillUnmount() {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: false,
      placeholder: '',
      // value: '',
    })
  }

  toAvatar() {
    Taro.navigateTo({
      url: '/pages/Avatar/Avatar'
    })
  }

  handleChange(key, range, e) {
    console.log(e)
    console.log(key)
    console.log(range)
    this.props.action(CHANGE_DOCTOR_DATA, {
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
    this.props.action(CHANGE_DOCTOR_DATA, {
      [key]: e.detail.value,
      isOpened: false,
      placeholder: '',
      // value: ''
    })
  }

  closeFloatLayout() {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: false,
      placeholder: ''
    })
  }

  edit(placeholder, value) {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: true,
      placeholder,
      // value,
      // focus: true
    })
  }

  saveChange() {
    const { myInfo } = this.props
    console.log(myInfo)
    if (!myInfo.name) {
      return Taro.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
    }
    if (!myInfo.hospital) {
      return Taro.showToast({
        title: '请填写所在医院',
        icon: 'none'
      })
    }
    if (!myInfo.department) {
      return Taro.showToast({
        title: '请填写所在科室',
        icon: 'none'
      })
    }
    if (!myInfo.phone) {
      return Taro.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
    }
    const reg = /^[1][34587]\d{9}$/;
    if (!reg.test(myInfo.phone)) {
      return Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
    }
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
      // 修改我的页面显示的医生姓名
      this.props.action(CHANGE_DOCTOR_NAME, {
        name: myInfo.name
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
    const _genderRange = ['M', 'F']
    const titleRange = ['主任医师', '副主任医师', '主治医师', '住院医师']
    return (
      <View className='myinfo'>
        <View className='icon'>
          <AtList>
            <AtListItem
              title='工作照'
              extraThumb={userInfo.avatarUrl}
              arrow='right'
              onClick={this.toAvatar.bind(this)}
            />
          </AtList>
        </View>
        <View>
          <AtList>
            <AtListItem
              title='姓名 *'
              extraText={myInfo.name}
              arrow='right'
              onClick={this.edit.bind(this, '姓名', myInfo.name)}
            />
            <Picker
              mode='selector'
              range={genderRange}
              value={_genderRange.indexOf(myInfo.gender)}
              onChange={this.handleChange.bind(this, 'gender', _genderRange)}
            >
              <AtListItem
                title='性别 *'
                extraText={myInfo.gender === 'M' ? '男' : '女'}
                arrow='right'
              />
            </Picker>
            <AtListItem
              title='所在医院 *'
              extraText={myInfo.hospital}
              arrow='right'
              onClick={this.edit.bind(this, '所在医院', myInfo.hospital)}
            />
            <AtListItem
              title='所在科室 *'
              extraText={myInfo.department}
              arrow='right'
              onClick={this.edit.bind(this, '所在科室', myInfo.department)}
            />
            <Picker
              mode='selector'
              range={titleRange}
              value={titleRange.indexOf(myInfo.title)}
              onChange={this.handleChange.bind(this, 'title', titleRange)}
            >
              <AtListItem
                title='职称 *'
                extraText={myInfo.title}
                arrow='right'
              />
            </Picker>
          </AtList>
          <View className='tip'>以上内容将展示给患者，请确保准确专业</View>
          <AtList>
            <AtListItem
              title='电话 *'
              extraText={myInfo.phone}
              arrow='right'
              onClick={this.edit.bind(this, '电话', myInfo.phone)}
            />
          </AtList>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
        <AtFloatLayout isOpened={myInfo.isOpened} onClose={this.closeFloatLayout.bind(this)}>
          {
            myInfo.isOpened && myInfo.placeholder === '姓名' &&
            <Input
              className='edit'
              placeholder='姓名'
              value={myInfo.name}
              adjustPosition={false}
              focus
              onConfirm={this.handleChange2.bind(this, myInfo.placeholder)}
            />
          }
          {
            myInfo.isOpened && myInfo.placeholder === '所在医院' &&
            <Input
              className='edit'
              placeholder='所在医院'
              value={myInfo.hospital}
              adjustPosition={false}
              focus
              onConfirm={this.handleChange2.bind(this, myInfo.placeholder)}
            />
          }
          {
            myInfo.isOpened && myInfo.placeholder === '所在科室' &&
            <Input
              className='edit'
              placeholder='所在科室'
              value={myInfo.department}
              adjustPosition={false}
              focus
              onConfirm={this.handleChange2.bind(this, myInfo.placeholder)}
            />
          }
          {
            myInfo.isOpened && myInfo.placeholder === '电话' &&
            <Input
              className='edit'
              placeholder='电话'
              value={myInfo.phone}
              adjustPosition={false}
              maxLength='11'
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
