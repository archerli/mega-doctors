import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import REPORT from '../../assets/report.png'

import './TagPicker.scss'

class TagPicker extends Component {

  constructor () {
    super(...arguments)
  }

  render () {
    const {
      text,
      onChange
    } = this.props
    return (
      <View className='msg-item'>
        <View className='msg-t'>{time}</View>
        {
          from === 'self'
          ? <View className='msg-c'>
            <View className='icon'></View>
            <View className='content self'>
              { this.createMsgContent() }
            </View>
            <View className='icon'>
              <Image src={icon} />
            </View>
          </View>
          : <View className='msg-c'>
            <View className='icon'>
              <Image src={icon} />
            </View>
            <View className='content'>
              { this.createMsgContent() }
            </View>
            <View className='icon'></View>
          </View>
        }
      </View>
    )
  }
}

export default TagPicker
