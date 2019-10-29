import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import VIP from '../../assets/vip.png'
import CLOCK from '../../assets/clock.png'
import JIFEN from '../../assets/jifen.png'

import './QCard.scss'

class QCard extends Component {

  constructor () {
    super(...arguments)
  }

  createCardT3 () {
    const { type, toQuestion } = this.props
    switch (type) {
      case 'new': {
        return (
          <View className='card-t-3'>
            <View className='msg'>
              <Image src={CLOCK} />
              <Text>4小时30分后失效</Text>
            </View>
            <View className='btn' onClick={toQuestion}>去回复</View>
          </View>
        )
      }
      case 'reply': {
        return (
          <View className='card-t-3'>
            <View className='msg'>
              <Image src={CLOCK} />
              <Text>4小时30分后结束</Text>
            </View>
            <View className='btn' onClick={toQuestion}>继续回复</View>
          </View>
        )
      }
      case 'finished': {
        return (
          <View className='card-t-3'>
            <View className='msg'>
              <Image src={JIFEN} />
              <Text style='color: #FFB503;'>贡献值：{'100'}</Text>
            </View>
            <View className='btn' onClick={toQuestion}>查看</View>
          </View>
        )
      }
    }
  }

  render () {
    const {
      type,
      name,
      isVip,
      icon,
      tag,
      time,
      desc,
      toQuestion
    } = this.props
    return (
      <View className='card'>
        <View className='card-t'>
          <View className='card-t-1'>
            <Image src={icon} />
          </View>
          <View className='card-t-2'>
            <View>
              <Text>{name}</Text>
              {
                isVip && <Image src={VIP} />
              }
            </View>
            <View>
              {
                tag.length && tag.map((item, index) => (
                  <Image src={item} key={index} />
                ))
              }
            </View>
          </View>
          { this.createCardT3() }
        </View>
        <View className='card-c'>
          <Text>问题描述：</Text>
          <Text style='color: #3D79E5; margin-right: 6px;'>[图片]</Text>
          <Text style='color: #FFB503; margin-right: 6px;'>[报告]</Text>
          <Text style='color: #666;'>{desc}</Text>
        </View>
        <View className='card-b'>
          <Text>{'上海'}用户 | 来源：{'扫码'}</Text>
          <Text>{time}</Text>
        </View>
      </View>
    )
  }
}

export default QCard