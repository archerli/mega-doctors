import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import VIP from '../../assets/vip.png'
import JIFEN from '../../assets/jifen.png'
import REPORT from '../../assets/report.png'
import MSG from '../../assets/msg.png'
import DEFAULT_P from '../../assets/avatar-p.png'

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
    const { questionId, patientId, name } = this.props
    if (!questionId) {
      return Taro.showToast({
        title: '最近没有咨询',
        icon: 'none'
      })
    }
    Taro.navigateTo({
      url: `/pages/Question/Question?questionId=${questionId}&patientId=${patientId}&name=${name}`
    })
  }

  toReport(e) {
    // const { reportId } = this.props
    // if (!reportId) {
    //   return Taro.showToast({
    //     title: '最近没有报告',
    //     icon: 'none'
    //   })
    // }
    // const url = 'https%3A%2F%2Fyl-dev.megahealth.cn%2F%23%2Fhome%2Freport%2F5db0cd8fba39c80071bb5c02%3Ftype%3DnoLogo'
    // Taro.navigateTo({
    //   url: `/pages/Webview/Webview?url=${url}`
    // })
    // console.log(e.detail.value)
    // const { patientReports } = this.props
    // console.log(patientReports)
    // const url = `https://raw.megahealth.cn/view#/parsemhn?objId=${patientReports[e.detail.value].id}`
    // Taro.navigateTo({
    //   url: `/pages/Webview/Webview?url=${encodeURIComponent(url)}`
    // })
  }

  toReportList() {
    const { patientId, name } = this.props
    Taro.navigateTo({
      url: `/pages/ReportList/ReportList?patientId=${patientId}&name=${name}`
    })
  }

  render () {
    const {
      name,
      isVip,
      icon,
      tag,
      credit,
      source,
      location,
      lastTime
    } = this.props
    return (
      <View className='card'>
        <View className='card-t'>
          <View className='card-t-1' onClick={this.toDetail.bind(this)}>
            <Image src={icon || DEFAULT_P} onError={() => {console.log('image error')}} />
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
            <View className='msg-1'>{location}用户丨来源：{source}</View>
            <View className='msg-2'>最近咨询：{lastTime}</View>
          </View>
          <View className='card-t-3'>
            <View className='msg'>
              <Image src={JIFEN} />
              <Text style='color: #FFB503;'>积分：{credit}</Text>
            </View>
            <View className='btn'>
              <Image className='img-m' src={MSG} onClick={this.toQuestion.bind(this)} />
              {/* <Picker mode='selector' range={reports} onChange={this.toReport.bind(this)}>
                <Image className='img-r' src={REPORT} onClick={onPickerClick} />
              </Picker> */}
              <Image className='img-r' src={REPORT} onClick={this.toReportList.bind(this)} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default PCard
