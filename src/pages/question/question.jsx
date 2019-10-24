import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTimeline, AtTextarea } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import MsgItem from '../../components/MsgItem/MsgItem'

import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import CLOCK from '../../assets/clock.png'

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
    navigationBarTitleText: '',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      tag1: '0',
      tag2: '0',
      tag3: '0',
      tag4: '0',
      tag5: '0'
    }
  }

  componentWillMount () {
    console.log(this.$router.params)
    const params = this.$router.params
    if (params && params.name) {
      Taro.setNavigationBarTitle({
        title: params.name
      })
    }
  }

  toRemark() {
    Taro.navigateTo({
      url: '/pages/remark/remark'
    })
  }

  previewImage(urls, current) {
    Taro.previewImage({
      urls,
      current
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
    const { tag1, tag2, tag3, tag4, tag5 } = this.state
    const tagRange = ['无', '轻度', '中度', '重度']
    return (
      <View className='question'>
        <View className='remark'>
          <View className='remark-1'>
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
          <View className='remark-2'></View>
          <View className='remark-3'>
            <View className='btn' onClick={this.toRemark.bind(this)}>备注</View>
          </View>
        </View>
        <View className='msg'>
          <MsgItem
            time='2018/10/23 18:00'
            from='other'
            icon={QING}
            type='text'
            content='张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好'
          />
          <MsgItem
            time='2018/10/23 18:10'
            from='other'
            icon={QING}
            type='text'
            content='张医生您好'
          />
          <MsgItem
            time='2018/10/23 18:20'
            from='other'
            icon={QING}
            type='image'
            content='http://megahealth.cn/asset/home/01.jpg'
            previewImage={this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/news-science/05.jpg'], 'http://megahealth.cn/asset/home/01.jpg')}
          />
          <MsgItem
            time='2018/10/23 18:20'
            from='other'
            icon={QING}
            type='image'
            content='http://megahealth.cn/asset/news-science/05.jpg'
            previewImage={this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/news-science/05.jpg'], 'http://megahealth.cn/asset/news-science/05.jpg')}
          />
          <MsgItem
            time='2018/10/23 18:30'
            from='other'
            icon={QING}
            type='link'
            content='https%3A%2F%2Fyl-dev.megahealth.cn%2F%23%2Fhome%2Freport%2F5db0cd8fba39c80071bb5c02%3Ftype%3DnoLogo'
          />
          <MsgItem
            time='2018/10/23 19:00'
            from='self'
            icon={CLOCK}
            type='text'
            content='好的'
          />
        </View>
        <View class='input'>
          <Input placeholder='患者在等待你的回复哦~' />
          <Button>结束</Button>
        </View>
      </View>
    )
  }
}

export default Questions
