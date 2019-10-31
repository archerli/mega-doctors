import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/counter'
import QRCODE from '../../assets/qrcode.png'

import './MyInfo.scss'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
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
        <View className='icon'>
          <AtList>
            <AtListItem
              title='工作照'
              extraText='王大锤'
              arrow='right'
            />
          </AtList>
        </View>
        <View>
          <AtList>
            <AtListItem
              title='姓名'
              extraText='王大锤'
              arrow='right'
            />
            <AtListItem
              title='性别'
              extraText='男'
              arrow='right'
            />
            <AtListItem
              title='所在医院'
              extraText='上海复旦大学附属医院'
              arrow='right'
            />
            <AtListItem
              title='所在科室'
              extraText='呼吸科'
              arrow='right'
            />
            <AtListItem
              title='职称'
              extraText='主任医师'
              arrow='right'
            />
            <AtListItem
              title='电话'
              extraText='18866667777'
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
