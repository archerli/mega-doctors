import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Input, Button, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import utils from '../../common/utils'
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
      tag5: '0',
      showRemark: true,
      scrollTop: 0,
      scrollIntoView: 'last-0',
      inputValue: '',
      msgList: [
        {
          time: '2018/10/23 18:00',
          from: 'other',
          icon: QING,
          type: 'text',
          content: '张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好'
        },
        {
          time: '2018/10/23 18:10',
          from: 'other',
          icon: QING,
          type: 'text',
          content: '张医生您好'
        },
        {
          time: '2018/10/23 18:20',
          from: 'other',
          icon: QING,
          type: 'image',
          content: 'http://megahealth.cn/asset/home/01.jpg',
          previewImage: this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/ring/pic_02.jpg'], 'http://megahealth.cn/asset/home/01.jpg')
        },
        {
          time: '2018/10/23 18:20',
          from: 'other',
          icon: QING,
          type: 'image',
          content: 'http://megahealth.cn/asset/ring/pic_02.jpg',
          previewImage: this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/ring/pic_02.jpg'], 'http://megahealth.cn/asset/ring/pic_02.jpg')
        },
        {
          time: '2018/10/23 18:30',
          from: 'other',
          icon: QING,
          type: 'link',
          content: 'https%3A%2F%2Fyl-dev.megahealth.cn%2F%23%2Fhome%2Freport%2F5db0cd8fba39c80071bb5c02%3Ftype%3DnoLogo'
        },
        {
          time: '2018/10/23 19:00',
          from: 'self',
          icon: CLOCK,
          type: 'text',
          content: '好的'
        }
      ]
    }
  }

  componentWillMount() {
    console.log(this.$router.params)
    const params = this.$router.params
    if (params && params.name) {
      Taro.setNavigationBarTitle({
        title: params.name
      })
    }
  }

  componentDidMount() {
    const { msgList } = this.state
    this.setState({
      scrollIntoView: `last-${msgList.length - 1}`
    })
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

  tagChange(id, e) {
    // console.log(id)
    // console.log(e.detail)
    this.setState({
      [`tag${id}`]: e.detail.value
    })
  }

  inputMsg(e) {
    // console.log(e.detail.value)
    this.setState({
      inputValue: e.detail.value
    })
  }

  sendMsg(e) {
    // console.log(e)
    const value = e.detail.value
    if (!value) return
    const { msgList } = this.state
    msgList.push({
      time: utils.formatTime(new Date().getTime(), 'yyyy/MM/dd HH:mm'),
      from: 'self',
      icon: CLOCK,
      type: 'text',
      content: e.detail.value
    })
    this.setState({
      msgList,
      scrollIntoView: `last-${msgList.length - 1}`,
      inputValue: ''
    })
  }

  onPageScroll(e) {
    let { scrollTop } = e.detail
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (scrollTop <= 0) {
      scrollTop = 0;
    } else if (scrollTop > Taro.getSystemInfoSync().windowHeight) {
      scrollTop = Taro.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (scrollTop > this.state.scrollTop || scrollTop == Taro.getSystemInfoSync().windowHeight) {
      this.setState({
        showRemark: true
      })
      //向下滚动
    } else {
      this.setState({
        showRemark: false
      })
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(() => {
      this.setState({
        scrollTop
      })
    }, 0)
  }

  render () {
    const { tag1, tag2, tag3, tag4, tag5, msgList, scrollIntoView, inputValue } = this.state
    const tagRange = ['无', '轻度', '中度', '重度']
    return (
      <View className='question'>
        <View className='remark'>
          <View className='remark-1'>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 1)}>
              <View className={`tag-${tag1}`}>{tag1 === '0' ? 'OSAHS' : `OSAHS | ${tagRange[tag1]}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 2)}>
              <View className={`tag-${tag2}`}>{tag2 === '0' ? 'COBP' : `COBP | ${tagRange[tag2]}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 3)}>
              <View className={`tag-${tag3}`}>{tag3 === '0' ? '冠心病' : `冠心病 | ${tagRange[tag3]}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 4)}>
              <View className={`tag-${tag4}`}>{tag4 === '0' ? '糖尿病' : `糖尿病 | ${tagRange[tag4]}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 5)}>
              <View className={`tag-${tag5}`}>{tag5 === '0' ? '高血压' : `高血压 | ${tagRange[tag5]}`}</View>
            </Picker>
          </View>
          <View className='remark-2'></View>
          <View className='remark-3'>
            <View className='btn' onClick={this.toRemark.bind(this)}>备注</View>
          </View>
        </View>
        <ScrollView
          className='msg'
          scrollY
          enableBackToTop
          scrollWithAnimation
          scrollIntoView={scrollIntoView}
          onScroll={this.onPageScroll.bind(this)}
        >
          {
            msgList.map((item, index) => (
              <MsgItem
                id={`last-${index}`}
                key={index}
                time={item.time}
                from={item.from}
                icon={item.icon}
                type={item.type}
                content={item.content}
                previewImage={item.previewImage || (() => {})}
              />
            ))
          }
          <View style='height: 1px;'></View> {/* 下边距在 ScrollView 不显示，使用一个 1px 的元素占位 */}
        </ScrollView>
        <View class='input'>
          <Input
            type='text'
            confirmHold={true}
            value={inputValue}
            placeholder='患者在等待你的回复哦~'
            confirmType='send'
            onInput={this.inputMsg.bind(this)}
            onConfirm={this.sendMsg.bind(this)}
          />
          <Button>结束</Button>
        </View>
      </View>
    )
  }
}

export default Questions
