import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { AtActivityIndicator } from 'taro-ui'

import AV from 'leancloud-storage/dist/av-weapp-min.js'
import { Realtime, TextMessage } from 'leancloud-realtime/dist/realtime.weapp.min.js'

import { swiperChange, getConsultationData } from '../../actions/creator'
import { SWIPER_CHANGE_INDEX } from '../../constants/creator'
import utils from '../../common/utils'

import QCard from '../../components/QCard/QCard'
import QRCODE from '../../assets/qrcode.png'
import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import STAR from '../../assets/star.png'
import EMPTY from '../../assets/empty.png'

import './Index.scss'

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
    time: '2019/10/09 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 22,
    name: '王大锤22',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [QING],
    time: '2019/10/08 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  // {
  //   id: 23,
  //   name: '王大锤23',
  //   isVip: true,
  //   icon: 'https://jdc.jd.com/img/200',
  //   tag: [],
  //   time: '2019/10/07 18:00',
  //   desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  // },
  // {
  //   id: 24,
  //   name: '王大锤24',
  //   icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
  //   tag: [STAR, ZHONG],
  //   time: '2019/10/06 18:00',
  //   desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  // }
];

@connect(({ consultation }) => ({
  consultation
}), (dispatch) => ({
  getConsultationData() {
    dispatch(getConsultationData())
  },
  swiperChange(type, current) {
    dispatch(swiperChange(type, current))
  }
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '咨询',
    // disableScroll: true,
    enablePullDownRefresh: true,
    backgroundColor: "#ececec"
  }

  constructor() {
    super(...arguments)
    this.state = {
      moreLoading: false,
      moreLoaded: false
    }
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    const havePhoneNumber = Taro.getStorageSync('havePhoneNumber')
    console.log(userInfo)
    console.log(havePhoneNumber)
    if (!userInfo) {
      Taro.reLaunch({
        url: '../Auth/Auth'
      })
    }
    this.props.getConsultationData()
    const haveTappedIndexTab = Taro.getStorageSync('haveTappedIndexTab')
    if (!haveTappedIndexTab) {
      Taro.setStorageSync('haveTappedIndexTab', true)
    }
  }

  componentWillUnmount() {}

  // 切换tab时刷新页面
  onTabItemTap() {
    console.log('onTabItemTap')
    const haveTappedIndexTab = Taro.getStorageSync('haveTappedIndexTab')
    if (haveTappedIndexTab) {
      this.props.getConsultationData()
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      // complete
      this.props.getConsultationData()
      Taro.hideNavigationBarLoading() //完成停止加载
      Taro.stopPullDownRefresh() //停止下拉刷新
    }, 800);
  }

  handleClick(value) {
    this.props.swiperChange(SWIPER_CHANGE_INDEX, value)
  }

  swiperOnChange(e) {
    this.props.swiperChange(SWIPER_CHANGE_INDEX, e.currentTarget.current)
  }

  // 上拉加载更多
  scrollToLower() {
    console.log('onScrollToLower!!!')
    this.setState({
      moreLoading: true
    })
    setTimeout(() => {
      this.setState({
        moreLoading: false,
        moreLoaded: true
      })
    }, 3000)
  }

  render () {
    const { consultation } = this.props
    const { moreLoading, moreLoaded } = this.state;
    return (
      <View className='index'>
        <View className='tab'>
          <View
            className={consultation.current === 0 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 0)}
          >新咨询</View>
          <View
            className={consultation.current === 1 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 1)}
          >回复中</View>
          <View
            className={consultation.current === 2 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 2)}
          >已结束</View>
        </View>
        <View className='content'>
          <Swiper
            className='content-swiper'
            current={consultation.current}
            onChange={this.swiperOnChange.bind(this)}
          >
            <SwiperItem className="content-swiper-item">
              {
                consultation.newCons.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View> {/* 上边距在 ScrollView 不满一屏时滚动，使用一个 1px 的元素占位 */}
                  {
                    consultation.newCons.map(item => (
                      <QCard
                        key={item.id}
                        type='new'
                        questionId={item.id}
                        patientId={item.patientId}
                        name={item.name}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        time={item.time}
                        desc={item.desc}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                  {/* {
                    moreLoading &&
                    <View className='content-t'>
                      <AtActivityIndicator content='加载中...' color='#48AEFC' size={24}></AtActivityIndicator>
                    </View>
                  }
                  {
                    !moreLoading && moreLoaded &&
                    <View className='content-t'>没有更多了</View>
                  } */}
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>无人咨询哦，可能需要在“我-设置”调整咨询时间</View>
                </View>
              }
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              {
                consultation.replying.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View>
                  {
                    consultation.replying.map(item => (
                      <QCard
                        key={item.id}
                        type='reply'
                        questionId={item.id}
                        patientId={item.patientId}
                        name={item.name}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        time={item.time}
                        desc={item.desc}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>您在新咨询的有效期内的回复会在此显示</View>
                </View>
              }
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              {
                consultation.finished.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View>
                  {
                    consultation.finished.map(item => (
                      <QCard
                        key={item.id}
                        type='finished'
                        questionId={item.id}
                        patientId={item.patientId}
                        name={item.name}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        time={item.time}
                        desc={item.desc}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>已结束的咨询单都会显示在这个地方哦</View>
                </View>
              }
            </SwiperItem>
          </Swiper>
        </View>
        {/* <View className='content'>
          <View className={`content-c ${current ? 'left' : ''}`}>
            <View className="content-l">
              {
                reply.map(item => (
                  <QCard
                    key={item.id}
                    name={item.name}
                    icon={item.icon}
                    time={item.time}
                    desc={item.desc}
                    toQuestion={this.toQuestion.bind(this, item.id)}
                  />
                ))
              }
            </View>
            <View className="content-l">
              {
                noReply.map(item => (
                  <QCard
                    key={item.id}
                    name={item.name}
                    icon={item.icon}
                    time={item.time}
                    desc={item.desc}
                    toQuestion={this.toQuestion.bind(this, item.id)}
                  />
                ))
              }
            </View>
          </View>
        </View> */}
      </View>
    )
  }
  // render() {
  //   const tabList = [{ title: '未回复' }, { title: '已回复' }]
  //   return (
  //     <View className='index'>
  //       <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)} style="overflow: auto;">
  //         <AtTabsPane current={this.state.current} index={0}>
  //           <View className="content-l">
  //             {
  //               noReply.map(item => (
  //                 <QCard
  //                   key={item.id}
  //                   type='reply'
  //                   name={item.name}
  //                   isVip={item.isVip}
  //                   icon={item.icon}
  //                   tag={item.tag}
  //                   time={item.time}
  //                   desc={item.desc}
  //                   toQuestion={this.toQuestion.bind(this, item.id)}
  //                 />
  //               ))
  //             }
  //           </View>
  //         </AtTabsPane>
  //         <AtTabsPane current={this.state.current} index={1}>
  //           <View className="content-l">
  //             {
  //               noReply.map(item => (
  //                 <QCard
  //                   key={item.id}
  //                   type='reply'
  //                   name={item.name}
  //                   isVip={item.isVip}
  //                   icon={item.icon}
  //                   tag={item.tag}
  //                   time={item.time}
  //                   desc={item.desc}
  //                   toQuestion={this.toQuestion.bind(this, item.id)}
  //                 />
  //               ))
  //             }
  //           </View>
  //         </AtTabsPane>
  //       </AtTabs>
  //     </View>
  //   )
  // }
}

export default Index
