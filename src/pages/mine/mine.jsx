import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtList, AtListItem, AtCurtain } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/counter'
import QRCODE from '../../assets/qrcode.png'

import './mine.scss'

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

class Mine extends Component {

  config = {
    navigationBarTitleText: '我'
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

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='mine'>
        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <Image
            style='width: 100%; height: 300px;'
            src={QRCODE}
          />
        </AtCurtain>
        <View className='at-row' style="padding: 20px 0;">
          <View className='at-col at-col-1 at-col--auto' style="margin: 0 20px;">
            <AtAvatar circle image='https://jdc.jd.com/img/200'></AtAvatar>
          </View>
          <View className='at-col'>
            <View>刘医生</View>
            <View>已认证</View>
          </View>
          <View className='at-col at-col-1 at-col--auto' style="margin: 0 20px;" onClick={this.handleChange.bind(this)}>
            <Image
              style="width: 40px; height: 40px;"
              src={QRCODE}
            />
          </View>
        </View>
        <AtList>
          <AtListItem
            title='咨询'
            arrow='right'
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
          <AtListItem
            title='帮助'
            arrow='right'
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
          <AtListItem
            title='设置'
            arrow='right'
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
        </AtList>
      </View>
    )
  }
}

export default Mine
