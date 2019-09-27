import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import './user.scss'


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

class User extends Component {

  config = {
    navigationBarTitleText: '用户'
  }

  constructor () {
    super(...arguments)
    this.state = {
      open1: true,
      open2: false,
      open3: false
    }
  }

  handleClick (index, value) {
    console.log(value);
    this.setState({
      [`open${index}`]: value
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
      <View className='user'>
        <AtAccordion
          open={this.state.open1}
          onClick={this.handleClick.bind(this, 1)}
          title='特别关注'
        >
          <AtList hasBorder={false}>
            <AtListItem
              title='张小明'
              note='特别关注'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='王小明'
              note='特别关注'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='李小明'
              note='特别关注'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
          </AtList>
        </AtAccordion>
        <AtAccordion
          open={this.state.open2}
          onClick={this.handleClick.bind(this, 2)}
          title='VIP 用户'
        >
          <AtList hasBorder={false}>
            <AtListItem
              title='张小明'
              note='VIP 用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='王小明'
              note='VIP 用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='李小明'
              note='VIP 用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
          </AtList>
        </AtAccordion>
        <AtAccordion
          open={this.state.open3}
          onClick={this.handleClick.bind(this, 3)}
          title='普通用户'
        >
          <AtList hasBorder={false}>
            <AtListItem
              title='张小明'
              note='普通用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='王小明'
              note='普通用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
            <AtListItem
              title='李小明'
              note='普通用户'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />
          </AtList>
        </AtAccordion>
      </View>
    )
  }
}

export default User
