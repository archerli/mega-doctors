import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTextarea } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import './remark.scss'


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

class Remark extends Component {

  config = {
    navigationBarTitleText: '回复',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      tag1: '0',
      tag2: '0',
      tag3: '0',
      tag4: '0',
      tag5: '0'
    }
  }

  handleChange (e) {
    this.setState({
      value: e.target.value
    })
  }

  tagChange1(e) {
    console.log(e.detail)
    this.setState({
      tag1: e.detail.value
    })
  }

  tagChange2(e) {
    this.setState({
      tag2: e.detail.value
    })
  }

  tagChange3(e) {
    this.setState({
      tag3: e.detail.value
    })
  }

  tagChange4(e) {
    this.setState({
      tag4: e.detail.value
    })
  }

  tagChange5(e) {
    this.setState({
      tag5: e.detail.value
    })
  }

  render () {
    const { value, tag1, tag2, tag3, tag4, tag5 } = this.state
    const tagRange = ['无', '轻度', '中度', '重度']
    return (
      <View className='remark'>
        <View className='tag'>
          <Picker mode='selector' range={tagRange} onChange={this.tagChange1.bind(this)}>
            <View className={`tag-${tag1}`}>{tag1 === '0' ? 'OSAHS' : `OSAHS | ${tagRange[tag1]}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} onChange={this.tagChange2.bind(this)}>
            <View className={`tag-${tag2}`}>{tag2 === '0' ? 'COBP' : `COBP | ${tagRange[tag2]}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} onChange={this.tagChange3.bind(this)}>
            <View className={`tag-${tag3}`}>{tag3 === '0' ? '冠心病' : `冠心病 | ${tagRange[tag3]}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} onChange={this.tagChange4.bind(this)}>
            <View className={`tag-${tag4}`}>{tag4 === '0' ? '糖尿病' : `糖尿病 | ${tagRange[tag4]}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} onChange={this.tagChange5.bind(this)}>
            <View className={`tag-${tag5}`}>{tag5 === '0' ? '高血压' : `高血压 | ${tagRange[tag5]}`}</View>
          </Picker>
        </View>
        <View className='input'>
          <AtTextarea
            showConfirmBar
            value={value}
            onChange={this.handleChange.bind(this)}
            maxLength={1000}
            placeholder='可备注患者的详细病况等，上限1000字。'
            height={500}
          />
        </View>
        <View class='btn'>
          <Button>保存</Button>
        </View>
      </View>
    )
  }
}

export default Remark
