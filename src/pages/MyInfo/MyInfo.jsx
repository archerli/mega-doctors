import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtFloatLayout } from "taro-ui"
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_DATA, CHANGE_DOCTOR_NAME } from '../../constants/creator'

import AVATAR_D from '../../assets/avatar-d.png'

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
    this.props.getDoctorData()
  }

  componentWillUnmount() {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: false,
      inputName: ''
    })
  }

  chooseImage() {
    Taro.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        Taro.navigateTo({
          url: `/pages/Avatar/Avatar?avatarUrl=${tempFilePaths[0]}`
        })
      }
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
    console.log(key)
    console.log(e)
    if (key === 'name') {
      const _value = e.detail.value.replace(/[^\x00-\xff]/g, '**');
      console.log(_value)
      if (_value.length > 20) {
        return Taro.showToast({
          title: '姓名限制10个汉字或20个字母、数字',
          icon: 'none'
        })
      }
    }
    this.props.action(CHANGE_DOCTOR_DATA, {
      [key]: e.detail.value,
      isOpened: false,
      inputName: ''
    })
  }

  submitChange(key, e) {
    console.log(key)
    console.log(e)
    const value = e.detail.value
    console.log(value[key])
    if (key === 'name') {
      const _value = value.name.replace(/[^\x00-\xff]/g, '**');
      console.log(_value)
      if (_value.length > 20) {
        return Taro.showToast({
          title: '姓名限制10个汉字或20个字母、数字',
          icon: 'none'
        })
      }
    }                                                               
    this.props.action(CHANGE_DOCTOR_DATA, {
      [key]: value[key],
      isOpened: false,
      inputName: ''
    })
  }

  closeFloatLayout() {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: false,
      inputName: ''
    })
  }

  edit(inputName) {
    this.props.action(CHANGE_DOCTOR_DATA, {
      isOpened: true,
      inputName
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
    if (myInfo.skill) doctor.set('skill', myInfo.skill);
    if (myInfo.description) doctor.set('description', myInfo.description);
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
        title: '保存失败，请稍后再试',
        icon: 'none'
      })
    });
  }

  render () {
    const { myInfo } = this.props
    const genderRange = ['男', '女']
    const _genderRange = ['M', 'F']
    const titleRange = ['主任医师', '副主任医师', '主治医师', '住院医师']
    return (
      <View className='myinfo'>
        <View className='icon'>
          <AtList>
            <AtListItem
              title='工作照'
              extraThumb={myInfo.avatar || AVATAR_D}
              arrow='right'
              onClick={this.chooseImage.bind(this)}
            />
          </AtList>
        </View>
        <View>
          <AtList>
            <AtListItem
              title='姓名 *'
              extraText={myInfo.name}
              arrow='right'
              onClick={this.edit.bind(this, 'name')}
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
              onClick={this.edit.bind(this, 'hospital')}
            />
            <AtListItem
              title='所在科室 *'
              extraText={myInfo.department}
              arrow='right'
              onClick={this.edit.bind(this, 'department')}
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
          <View className='title'>医生主页展示</View>
          <AtList>
            <AtListItem
              title='擅长病症'
              extraText={myInfo.skill}
              arrow='right'
              onClick={this.edit.bind(this, 'skill')}
            />
            <AtListItem
              title='个人介绍'
              extraText={myInfo.description}
              arrow='right'
              onClick={this.edit.bind(this, 'description')}
            />
          </AtList>
          <View className='tip'>以上内容将展示给患者，请确保准确专业</View>
          <AtList>
            <AtListItem
              title='电话 *'
              extraText={myInfo.phone}
              arrow='right'
              onClick={this.edit.bind(this, 'phone')}
            />
          </AtList>
        </View>
        <View class='btn'>
          <Button className='save' onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
        <AtFloatLayout isOpened={myInfo.isOpened} onClose={this.closeFloatLayout.bind(this)}>
          <Form className='float-layout' onSubmit={this.submitChange.bind(this, myInfo.inputName)}>
            <View>
              {
                myInfo.isOpened && myInfo.inputName === 'name' &&
                <Input
                  name='name'
                  className='edit'
                  placeholder='姓名限制10个汉字或20个字母、数字'
                  maxLength='20'
                  value={myInfo.name}
                  adjustPosition={false}
                  focus
                  onConfirm={this.handleChange2.bind(this, 'name')}
                />
              }
              {
                myInfo.isOpened && myInfo.inputName === 'hospital' &&
                <Input
                  name='hospital'
                  className='edit'
                  placeholder='所在医院'
                  value={myInfo.hospital}
                  adjustPosition={false}
                  focus
                  onConfirm={this.handleChange2.bind(this, 'hospital')}
                />
              }
              {
                myInfo.isOpened && myInfo.inputName === 'department' &&
                <Input
                  name='department'
                  className='edit'
                  placeholder='所在科室'
                  value={myInfo.department}
                  adjustPosition={false}
                  focus
                  onConfirm={this.handleChange2.bind(this, 'department')}
                />
              }
              {
                myInfo.isOpened && myInfo.inputName === 'phone' &&
                <Input
                  name='phone'
                  className='edit'
                  type="number"
                  placeholder='电话'
                  value={myInfo.phone}
                  adjustPosition={false}
                  maxLength='11'
                  focus
                  onConfirm={this.handleChange2.bind(this, 'phone')}
                />
              }
              {
                myInfo.isOpened && myInfo.inputName === 'skill' &&
                <Textarea
                  name='skill'
                  className='edit-area'
                  placeholder='请输入您的擅长病症，将展示在 APP 中您的主页'
                  value={myInfo.skill}
                  maxlength={500}
                  focus
                  showConfirmBar={false}
                  onConfirm={this.handleChange2.bind(this, 'skill')}
                />
              }
              {
                myInfo.isOpened && myInfo.inputName === 'description' &&
                <Textarea
                  name='description'
                  className='edit-area'
                  placeholder='请输入您的个人介绍，将展示在 APP 中您的主页'
                  value={myInfo.description}
                  maxlength={500}
                  focus
                  showConfirmBar={false}
                  onConfirm={this.handleChange2.bind(this, 'description')}
                />
              }
              <Button className='confirm' form-type='submit'>完成</Button>
            </View>
          </Form>
        </AtFloatLayout>
      </View>
    )
  }
}

export default MyInfo
