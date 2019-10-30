import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import REPORT from '../../assets/report.png'

import './MsgItem.scss'

class MsgItem extends Component {

  constructor () {
    super(...arguments)
  }

  createMsgContent() {
    const { type, content, previewImage } = this.props
    switch (type) {
      case 'text': {
        return (
          <View className='text'>{content}</View>
        )
      }
      case 'image': {
        return (
          <Image
            className='image'
            mode='widthFix'
            src={content}
            onClick={previewImage}
          />
        )
      }
      case 'link': {
        return (
          <View className='link' onClick={this.toWebview.bind(this, content)}>
            <View>
              <Text>王大锤的睡眠报告</Text>
              <Text>2019-10-23</Text>
            </View>
            <View>
              <Image src={REPORT} />
            </View>
          </View>
        )
      }
    }
  }

  toDetail() {
    Taro.navigateTo({
      url: `/pages/PatientDetail/PatientDetail`
    })
  }

  toWebview(url) {
    Taro.navigateTo({
      url: `/pages/Webview/Webview?url=${url}`
    })
  }

  render () {
    const {
      time,
      from,
      icon
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
            <View className='icon' onClick={this.toDetail.bind(this)}>
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

export default MsgItem
