import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTimeline, AtTextarea } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import './question.scss'


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

class Questions extends Component {

  config = {
    navigationBarTitleText: '回复'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='question'>
        <View className='card'>
          <View className='card-1'>
            <Image
              style='width: 52px; height: 52px; border-radius: 52px;'
              src='https://jdc.jd.com/img/200'
            />
          </View>
          <View className='card-2'>
            <View>小明</View>
          </View>
          <View className='card-3'>
            <Image
              style='width: 52px; height: 52px; border-radius: 52px;'
              src='https://jdc.jd.com/img/200'
            />
          </View>
        </View>
        <View className='timeline'>
          <AtTimeline 
            items={[
              { title: '问题描述（10/09 08:00）', content: ['医生您好医生您好医生您好医生您好医生您好医生您好医生您好医生您好'] },
              { title: '问题描述（10/09 08:00）', content: ['医生您好医生您好医生您好医生您好医生您好医生您好医生您好医生您好'] },
              { title: '问题描述（10/09 08:00）', content: ['医生您好医生您好医生您好医生您好医生您好医生您好医生您好医生您好'] },
              { title: '问题描述（10/09 08:00）', content: ['医生您好医生您好医生您好医生您好医生您好医生您好医生您好医生您好'] }
            ]}
          >
          </AtTimeline>
        </View>
        <View class='input'>
          <AtTextarea
            // value={this.state.value}
            // onChange={this.handleChange.bind(this)}
            maxLength={200}
            placeholder='回复...'
          />
        </View>
      </View>
    )
  }
}

export default Questions
