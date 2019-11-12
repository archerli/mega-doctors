import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTextarea } from 'taro-ui'
import AV from 'leancloud-storage/dist/av-weapp-min.js'

import { action, getPatientData } from '../../actions/creator'
import { CHANGE_DOCTOR_PATIENT_TAG, CHANGE_DOCTOR_PATIENT_REMARK } from '../../constants/creator'

import './Remark.scss'

@connect(({ remark }) => ({
  remark
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getPatientData(id) {
    dispatch(getPatientData(id))
  }
}))

class Remark extends Component {

  config = {
    navigationBarTitleText: '备注',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
  }

  componentWillMount() {
    const { params } = this.$router
    console.log(params)
    this.props.getPatientData(params.patientId)
  }

  tagChange(key, e) {
    // console.log(key)
    // console.log(e.detail)
    const { remark } = this.props
    const tag = {
      ...remark.tag,
      [key]: e.detail.value
    }
    const relation = AV.Object.createWithoutData('DoctorPatientRelation', remark.relationId)
    relation.set('tag', tag)
    relation.save().then(res => {
      // console.log(res)
      this.props.action(CHANGE_DOCTOR_PATIENT_TAG, res.get('tag'))
    })
  }

  handleChange(e) {
    console.log(e)
    this.props.action(CHANGE_DOCTOR_PATIENT_REMARK, e.detail.value)
  }

  saveChange() {
    const { remark } = this.props
    const relation = AV.Object.createWithoutData('DoctorPatientRelation', remark.relationId);
    relation.set('remark', remark.remark);
    relation.save().then(res => {
      Taro.showToast({
        title: '保存成功'
      })
    }, err => {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    });
  }

  render () {
    const { tag, remark } = this.props.remark
    const tagRange = ['无', '轻度', '中度', '重度']
    return (
      <View className='remark'>
        <View className='tag'>
          <Picker mode='selector' range={tagRange} value={tag.osahs} onChange={this.tagChange.bind(this, 'osahs')}>
            <View className={`tag-${tag.osahs}`}>{tag.osahs === '0' ? 'OSAHS' : `OSAHS | ${tagRange[tag.osahs].substr(0, 1)}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} value={tag.cobp} onChange={this.tagChange.bind(this, 'cobp')}>
            <View className={`tag-${tag.cobp}`}>{tag.cobp === '0' ? 'COBP' : `COBP | ${tagRange[tag.cobp].substr(0, 1)}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} value={tag.gxb} onChange={this.tagChange.bind(this, 'gxb')}>
            <View className={`tag-${tag.gxb}`}>{tag.gxb === '0' ? '冠心病' : `冠心病 | ${tagRange[tag.gxb].substr(0, 1)}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} value={tag.tnb} onChange={this.tagChange.bind(this, 'tnb')}>
            <View className={`tag-${tag.tnb}`}>{tag.tnb === '0' ? '糖尿病' : `糖尿病 | ${tagRange[tag.tnb].substr(0, 1)}`}</View>
          </Picker>
          <Picker mode='selector' range={tagRange} value={tag.gxy} onChange={this.tagChange.bind(this, 'gxy')}>
            <View className={`tag-${tag.gxy}`}>{tag.gxy === '0' ? '高血压' : `高血压 | ${tagRange[tag.gxy].substr(0, 1)}`}</View>
          </Picker>
        </View>
        <View className='input'>
          <AtTextarea
            showConfirmBar
            value={remark}
            onChange={this.handleChange.bind(this)}
            maxLength={1000}
            placeholder='可备注患者的详细病况等，上限1000字。'
            height={500}
          />
        </View>
        <View class='btn'>
          <Button onClick={this.saveChange.bind(this)}>保存</Button>
        </View>
      </View>
    )
  }
}

export default Remark
