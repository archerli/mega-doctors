import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { getDoctorData } from '../../actions/creator'
import QRCODE from '../../assets/qrcode.png'

import './MyInfo.scss'

@connect(({ myInfo }) => ({
  myInfo
}), (dispatch) => ({
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
    this.state = {
      isOpened: false,
    }
  }

  componentDidMount() {
    this.props.getDoctorData();
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
    const { myInfo } = this.props
    return (
      <View className='myinfo'>
        <View className='icon'>
          <AtList>
            <AtListItem
              title='工作照'
              extraThumb={QRCODE}
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
            />
            <AtListItem
              title='性别'
              extraText={myInfo.gender === 'M' ? '男' : '女'}
              arrow='right'
            />
            <AtListItem
              title='所在医院'
              extraText={myInfo.hospital}
              arrow='right'
            />
            <AtListItem
              title='所在科室'
              extraText={myInfo.department}
              arrow='right'
            />
            <AtListItem
              title='职称'
              extraText={myInfo.title}
              arrow='right'
            />
            <AtListItem
              title='电话'
              extraText={myInfo.phone}
              arrow='right'
            />
          </AtList>
        </View>
        <View class='btn'>
          <Button className='save'>保存</Button>
        </View>
      </View>
    )
  }
}

export default MyInfo
