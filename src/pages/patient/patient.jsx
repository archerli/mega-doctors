import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { AtActivityIndicator } from 'taro-ui'

import { getDoctorPatientData, swiperChange } from '../../actions/creator'

import PCard from '../../components/PCard/PCard'
import QRCODE from '../../assets/qrcode.png'
import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import STAR from '../../assets/star.png'

import './Patient.scss'

const reply = [
  {
    id: 11,
    name: '王大锤11',
    isVip: true,
    icon: QRCODE,
    tag: [STAR, QING],
    time: '2019/10/09 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 12,
    name: '王大锤12',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [ZHONG],
    time: '2019/10/08 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 13,
    name: '王大锤13',
    isVip: true,
    icon: 'https://jdc.jd.com/img/200',
    tag: [],
    time: '2019/10/07 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 14,
    name: '王大锤14',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [STAR, ZHONG],
    time: '2019/10/06 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 15,
    name: '王大锤15',
    icon: 'https://jdc.jd.com/img/200',
    tag: [QING],
    time: '2019/10/05 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  }
];
const noReply = [
  {
    id: 21,
    name: '王大锤21',
    icon: QRCODE,
    tag: [ZHONG],
  },
  {
    id: 22,
    name: '王大锤22',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [QING],
  },
  {
    id: 23,
    name: '王大锤23',
    isVip: true,
    icon: 'https://jdc.jd.com/img/200',
    tag: [],
  },
  {
    id: 24,
    name: '王大锤24',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [STAR, ZHONG],
  }
];

@connect(({ patient }) => ({
  patient
}), (dispatch) => ({
  getDoctorPatientData() {
    dispatch(getDoctorPatientData())
  },
  swiperChange (current) {
    dispatch(swiperChange(current))
  }
}))

class Patient extends Component {

  config = {
    navigationBarTitleText: '咨询',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      moreLoading: false,
      moreLoaded: false
    }
  }

  componentDidMount() {
    this.props.getDoctorPatientData();
  }

  toQuestion() {
    Taro.navigateTo({
      url: '/pages/Question/Question'
    })
  }

  // 下拉刷新
  // onPullDownRefresh() {
  //   Taro.showNavigationBarLoading() //在标题栏中显示加载
  //   setTimeout(() => {
  //     // complete
  //     // this.load();
  //     Taro.hideNavigationBarLoading() //完成停止加载
  //     Taro.stopPullDownRefresh() //停止下拉刷新
  //   }, 800);
  // }

  handleClick(value) {
    // this.setState({
    //   current: value 
    // })
    this.props.swiperChange(value)
  }

  swiperOnChange(e) {
    // console.log(e.currentTarget.current);
    // this.setState({
    //   current: e.currentTarget.current
    // })
    this.props.swiperChange(e.currentTarget.current)
  }

  // 上拉加载更多
  scrollToLower() {
    console.log('onScrollToLower!!!')
    // this.setState({
    //   moreLoading: true
    // })
    // setTimeout(() => {
    //   this.setState({
    //     moreLoading: false,
    //     moreLoaded: true
    //   })
    // }, 3000)
  }

  render () {
    const { patient } = this.props
    const { moreLoading, moreLoaded } = this.state
    return (
      <View className='patient'>
        <View className='tab'>
          <View
            className={patient.current === 0 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 0)}
          >VIP患者</View>
          <View
            className={patient.current === 1 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 1)}
          >付费过</View>
          <View
            className={patient.current === 2 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 2)}
          >关注的</View>
          <View
            className={patient.current === 3 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 3)}
          >普通的</View>
        </View>
        <View className='content'>
          <Swiper
            className='content-swiper'
            current={patient.current}
            onChange={this.swiperOnChange.bind(this)}
          >
            <SwiperItem className="content-swiper-item">
              <ScrollView
                className="content-l"
                scrollY
                enableBackToTop
                onScrollToLower={this.scrollToLower.bind(this)}
              >
                <View style='height: 1px;'></View> {/* 上边距在 ScrollView 不满一屏时滚动，使用一个 1px 的元素占位 */}
                {
                  patient.vip.map(item => (
                    <PCard
                      key={item.id}
                      patientId={item.id}
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      toQuestion={this.toQuestion.bind(this, item.id)}
                    />
                  ))
                }
                {
                  moreLoading &&
                  <View className='content-t'>
                    <AtActivityIndicator content='加载中...' color='#48AEFC' size={24}></AtActivityIndicator>
                  </View>
                }
                {
                  !moreLoading && moreLoaded &&
                  <View className='content-t'>没有更多了</View>
                }
              </ScrollView>
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              <ScrollView
                className="content-l"
                scrollY
                enableBackToTop
                // onScrollToLower={this.scrollToLower.bind(this)}
              >
                <View style='height: 1px;'></View>
                {
                  noReply.map(item => (
                    <PCard
                      key={item.id}
                      patientId={item.id}
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      toQuestion={this.toQuestion.bind(this, item.id)}
                    />
                  ))
                }
              </ScrollView>
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              <ScrollView
                className="content-l"
                scrollY
                enableBackToTop
                // onScrollToLower={this.scrollToLower.bind(this)}
              >
                <View style='height: 1px;'></View>
                {
                  noReply.map(item => (
                    <PCard
                      key={item.id}
                      patientId={item.id}
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      toQuestion={this.toQuestion.bind(this, item.id)}
                    />
                  ))
                }
              </ScrollView>
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              <ScrollView
                className="content-l"
                scrollY
                enableBackToTop
                // onScrollToLower={this.scrollToLower.bind(this)}
              >
                <View style='height: 1px;'></View>
                {
                  noReply.map(item => (
                    <PCard
                      key={item.id}
                      patientId={item.id}
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      toQuestion={this.toQuestion.bind(this, item.id)}
                    />
                  ))
                }
              </ScrollView>
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    )
  }
}

export default Patient
