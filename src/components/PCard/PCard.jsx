import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import VIP from '../../assets/vip.png'
import CLOCK from '../../assets/clock.png'
import JIFEN from '../../assets/jifen.png'
import REPORT from '../../assets/report.png'
import MSG from '../../assets/msg.png'
import DEFAULT_A from '../../assets/avatar-p.png'

import './PCard.scss'

class PCard extends Component {

  constructor () {
    super(...arguments)
  }

  toDetail() {
    const { patientId } = this.props
    Taro.navigateTo({
      url: `/pages/PatientInfo/PatientInfo?patientId=${patientId}`
    })
  }

  toQuestion() {
    const { patientId } = this.props
    Taro.navigateTo({
      url: `/pages/Question/Question?patientId=${patientId}`
    })
  }

  render () {
    const {
      name,
      isVip,
      icon,
      tag
    } = this.props
    return (
      <View className='card'>
        <View className='card-t'>
          <View className='card-t-1' onClick={this.toDetail.bind(this)}>
            <Image src={icon || DEFAULT_A} />
          </View>
          <View className='card-t-2' onClick={this.toDetail.bind(this)}>
            <View>
              <Text>{name || '患者'}</Text>
              {
                isVip && <Image src={VIP} />
              }
              {
                tag.length && tag.map((item, index) => (
                  <Image src={item} key={index} />
                ))
              }
            </View>
            <View className='msg-1'>上海用户丨来源：扫码</View>
            <View className='msg-2'>最后咨询时间：30天前</View>
          </View>
          <View className='card-t-3'>
            <View className='msg'>
              <Image src={JIFEN} />
              <Text style='color: #FFB503;'>贡献值：{'100'}</Text>
            </View>
            <View className='btn' onClick={this.toQuestion.bind(this)}>
              <Image className='img-m' src={MSG} />
              <Image className='img-r' src={REPORT} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default PCard
