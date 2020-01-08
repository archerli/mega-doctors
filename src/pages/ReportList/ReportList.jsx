import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from "taro-ui"
// import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getPatientReportList } from '../../actions/creator'
// import { CHANGE_DOCTOR_DATA, CHANGE_DOCTOR_NAME } from '../../constants/creator'

import EMPTY from '../../assets/empty.png'

import './ReportList.scss'

@connect(({ reportList }) => ({
  reportList
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getPatientReportList(patientId, showLoading) {
    dispatch(getPatientReportList(patientId, showLoading))
  }
}))

class ReportList extends Component {

  config = {
    navigationBarTitleText: '报告列表',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
  }

  componentWillMount() {
    const { params } = this.$router
    const { patientId } = this.props.reportList
    if (params && params.name) {
      Taro.setNavigationBarTitle({
        title: `${params.name}的睡眠报告`
      })
    }
    if (params.patientId !== patientId) {
      Taro.showLoading({
        title: '加载中...',
        mask: true
      })
      this.props.getPatientReportList(params.patientId, true)
    }
  }

  componentDidMount() {}

  toReport(reportId) {
    const url = `https://raw.megahealth.cn/view#/parsemhn?objId=${reportId}`
    const { params } = this.$router
    Taro.navigateTo({
      url: `/pages/Webview/Webview?url=${encodeURIComponent(url)}&name=${params.name}`
    })
  }

  render () {
    const { isLoading, reportList } = this.props.reportList
    return (
      <View className='reportlist'>
        { !isLoading && reportList.length && <View className='report-num'>共 {reportList.length} 份睡眠报告</View> }
        {
          reportList.length
          ? !isLoading && reportList.map((item, index) => (
            <View key={index} className='report-item' onClick={this.toReport.bind(this, item.id)}>
              <View className='item-1'>
                <View>
                  <AtIcon value='calendar' size='18' color='#48AEFC'></AtIcon>
                  <Text>{item.date}</Text>
                </View>
                <View>
                  <Text>{parseInt(item.duration / 3600)}小时{parseInt(item.duration / 60) % 60}分钟</Text>
                  <AtIcon value='chevron-right' size='20' color='#999999'></AtIcon>
                </View>
              </View>
              <View className='item-2'>
                <View className='item-data'>
                  <View>氧减饱和度指数</View>
                  <View>{item.ODI}</View>
                </View>
                <View className='item-data'>
                  <View>氧减次数</View>
                  <View>{item.downTimes}</View>
                </View>
                <View className='item-data'>
                  <View>最低血氧饱和度</View>
                  <View>{item.minO2}%</View>
                </View>
                {/* <View className='item-data'>
                  <View>时长</View>
                  <View>{parseInt(item.duration / 3600)}小时{parseInt(item.duration / 60) % 60}分钟</View>
                </View> */}
              </View>
            </View>
          ))
          : !isLoading && <View className='content-empty'>
            <Image src={EMPTY} />
            <View>患者还没有睡眠报告</View>
          </View>
        }
      </View>
    )
  }
}

export default ReportList
