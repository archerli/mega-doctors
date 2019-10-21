import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { AtActivityIndicator } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import QCard from '../../components/QCard/QCard'
import QRCODE from '../../assets/qrcode.png'
import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import STAR from '../../assets/star.png'

import './index.scss'

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
  {
    id: 23,
    name: '王大锤23',
    isVip: true,
    icon: 'https://jdc.jd.com/img/200',
    tag: [],
    time: '2019/10/07 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  },
  {
    id: 24,
    name: '王大锤24',
    icon: 'http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    tag: [STAR, ZHONG],
    time: '2019/10/06 18:00',
    desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
  }
];

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
      current: 0,
      moreLoading: false,
      moreLoaded: false
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  toQuestion() {
    Taro.navigateTo({
      url: '/pages/question/question'
    })
  }

  // 下拉刷新
  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      // complete
      // this.load();
      Taro.hideNavigationBarLoading() //完成停止加载
      Taro.stopPullDownRefresh() //停止下拉刷新
    }, 800);
  }

  handleClick(value) {
    this.setState({
      current: value 
    })
  }

  swiperOnChange(e) {
    // console.log(e.currentTarget.current);
    this.setState({
      current: e.currentTarget.current
    })
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
    const { current, moreLoading, moreLoaded } = this.state;
    return (
      <View className='index'>
        <View className='tab'>
          <View
            className={current === 0 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 0)}
          >新咨询</View>
          <View
            className={current === 1 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 1)}
          >回复中</View>
          <View
            className={current === 2 ? 'selected' : ''}
            onClick={this.handleClick.bind(this, 2)}
          >已结束</View>
        </View>
        <View className='content'>
          <Swiper
            className='content-swiper'
            current={current}
            onChange={this.swiperOnChange.bind(this)}
          >
            <SwiperItem className="content-swiper-item">
              <ScrollView
                className="content-l"
                scrollY
                enableBackToTop
                onScrollToLower={this.scrollToLower.bind(this)}
              >
                {
                  reply.map(item => (
                    <QCard
                      key={item.id}
                      type='new'
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      time={item.time}
                      desc={item.desc}
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
                {
                  noReply.map(item => (
                    <QCard
                      key={item.id}
                      type='reply'
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      time={item.time}
                      desc={item.desc}
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
                {
                  noReply.map(item => (
                    <QCard
                      key={item.id}
                      type='finished'
                      name={item.name}
                      isVip={item.isVip}
                      icon={item.icon}
                      tag={item.tag}
                      time={item.time}
                      desc={item.desc}
                      toQuestion={this.toQuestion.bind(this, item.id)}
                    />
                  ))
                }
              </ScrollView>
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
