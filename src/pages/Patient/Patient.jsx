import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Swiper, SwiperItem, PickerView, PickerViewColumn } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { AtActivityIndicator, AtCalendar } from 'taro-ui'

import { action, getDoctorPatientData, getPatientReportList, swiperChange } from '../../actions/creator'
import { SWIPER_CHANGE_PATIENT } from '../../constants/creator'

import PCard from '../../components/PCard/PCard'
import EMPTY from '../../assets/empty.png'

import './Patient.scss'

@connect(({ patient }) => ({
  patient
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getDoctorPatientData() {
    dispatch(getDoctorPatientData())
  },
  getPatientReportList(patientId) {
    dispatch(getPatientReportList(patientId))
  },
  swiperChange(type, current) {
    dispatch(swiperChange(type, current))
  }
}))

class Patient extends Component {

  config = {
    navigationBarTitleText: '患者',
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
    if (userInfo) {
      this.props.getDoctorPatientData()
      const haveTappedPatientTab = Taro.getStorageSync('haveTappedPatientTab')
      if (!haveTappedPatientTab) {
        Taro.setStorageSync('haveTappedPatientTab', true)
      }
    }
  }

  // 切换tab时刷新页面
  onTabItemTap() {
    console.log('onTabItemTap')
    const haveTappedPatientTab = Taro.getStorageSync('haveTappedPatientTab')
    if (haveTappedPatientTab) {
      this.props.getDoctorPatientData()
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      // complete
      this.props.getDoctorPatientData()
      Taro.hideNavigationBarLoading() //完成停止加载
      Taro.stopPullDownRefresh() //停止下拉刷新
    }, 800);
  }

  handleClick(value) {
    this.props.swiperChange(SWIPER_CHANGE_PATIENT, value)
  }

  swiperOnChange(e) {
    // console.log(e.currentTarget.current);
    this.props.swiperChange(SWIPER_CHANGE_PATIENT, e.currentTarget.current)
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
              {
                patient.vipList.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View> {/* 上边距在 ScrollView 不满一屏时滚动，使用一个 1px 的元素占位 */}
                  {
                    patient.vipList.map(item => (
                      <PCard
                        key={item.id}
                        patientId={item.id}
                        name={item.name || '患者'}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        credit={item.credit}
                        source={item.source}
                        location={item.location}
                        lastTime={item.lastTime}
                        questionId={item.latestConsultationId}
                        reportId={item.latestReportId}
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
                  <View>您还没有VIP包年患者哦</View>
                </View>
              }
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              {
                patient.paidList.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View>
                  {
                    patient.paidList.map(item => (
                      <PCard
                        key={item.id}
                        patientId={item.id}
                        name={item.name || '患者'}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        credit={item.credit}
                        source={item.source}
                        location={item.location}
                        lastTime={item.lastTime}
                        questionId={item.latestConsultationId}
                        reportId={item.latestReportId}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>还没有患者付费咨询哦，是不是设置中没有开启咨询</View>
                </View>
              }
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              {
                patient.followList.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View>
                  {
                    patient.followList.map(item => (
                      <PCard
                        key={item.id}
                        patientId={item.id}
                        name={item.name || '患者'}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        credit={item.credit}
                        source={item.source}
                        location={item.location}
                        lastTime={item.lastTime}
                        questionId={item.latestConsultationId}
                        reportId={item.latestReportId}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>加星关注重要患者，咨询更优先</View>
                </View>
              }
            </SwiperItem>
            <SwiperItem className="content-swiper-item">
              {
                patient.normalList.length
                ? <ScrollView
                  className="content-l"
                  scrollY
                  enableBackToTop
                  // onScrollToLower={this.scrollToLower.bind(this)}
                >
                  <View style='height: 1px;'></View>
                  {
                    patient.normalList.map(item => (
                      <PCard
                        key={item.id}
                        patientId={item.id}
                        name={item.name || '患者'}
                        isVip={item.isVip}
                        icon={item.icon}
                        tag={item.tag}
                        credit={item.credit}
                        source={item.source}
                        location={item.location}
                        lastTime={item.lastTime}
                        questionId={item.latestConsultationId}
                        reportId={item.latestReportId}
                      />
                    ))
                  }
                  <View style='height: 1px;'></View>
                </ScrollView>
                : <View className='content-empty'>
                  <Image src={EMPTY} />
                  <View>快去邀请您的患者扫码关注您吧</View>
                </View>
              }
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    )
  }
}

export default Patient
