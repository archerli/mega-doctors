import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import { AtIcon } from "taro-ui"

import { getDoctorData } from '../../actions/creator'

import ADD_IMG from '../../assets/add-img.png'

import './DoctorAuth.scss'

@connect(({}) => ({

}), (dispatch) => ({
  getDoctorData() {
    dispatch(getDoctorData())
  }
}))

class DoctorAuth extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {
      authenticated: '',
      zg: [],
      zy: []
    }
  }

  componentWillMount() {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('Doctor')
    query.get(doctorid).then(res => {
      console.log(res)
      const zg1 = res.get('certificate1') && res.get('certificate1').get('url') || null
      const zg2 = res.get('certificate2') && res.get('certificate2').get('url') || null
      const zy1 = res.get('licence1') && res.get('licence1').get('url') || null
      const zy2 = res.get('licence2') && res.get('licence2').get('url') || null
      const zg = []
      const zy = []
      if (zg1) zg.push(zg1)
      if (zg2) zg.push(zg2)
      if (zy1) zy.push(zy1)
      if (zy2) zy.push(zy2)
      this.setState({
        authenticated: res.get('authenticated'),
        zg,
        zy
      })
    }, err => {
      console.log(err)
    })
  }

  chooseImage(type) {
    const { authenticated, zg, zy } = this.state
    if (authenticated == '2') return
    const imgList = type === 'zg' ? zg : zy
    Taro.chooseImage({
      count: 2 - imgList.length,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        tempFilePaths.forEach(item => {
          imgList.push(item)
        })
        this.setState({
          [type]: imgList
        })
      }
    })
  }

  previewImage(urls, current) {
    Taro.previewImage({
      urls,
      current
    })
  }

  removeImage(url, type) {
    const { zg, zy } = this.state
    const imgList = type === 'zg' ? zg : zy
    imgList.remove(url)
    this.setState({
      [type]: imgList
    })
  }

  async uploadImage() {
    const fileDomain = 'file-mhn.megahealth.cn'
    const { zg, zy } = this.state
    const doctorid = Taro.getStorageSync('doctorid')
    if (zg.length === 2 || zy.length === 2) {
      Taro.showLoading({
        title: '正在上传...',
        mask: true
      })
      try {
        let _file1 = null
        let _file2 = null
        let _file3 = null
        let _file4 = null
        if (zg[0] && zg[0].indexOf(fileDomain) === -1) {
          const file1 = new AV.File(`doctor_licence_${doctorid}.jpg`, {
            blob: {
              uri: zg[0],
            }
          })
          _file1 = await file1.save()
        }
        if (zg[1] && zg[1].indexOf(fileDomain) === -1) {
          const file2 = new AV.File(`doctor_licence_${doctorid}.jpg`, {
            blob: {
              uri: zg[1],
            }
          })
          _file2 = await file2.save()
        }
        if (zy[0] && zy[0].indexOf(fileDomain) === -1) {
          const file3 = new AV.File(`doctor_licence_${doctorid}.jpg`, {
            blob: {
              uri: zy[0],
            }
          })
          _file3 = await file3.save()
        }
        if (zy[1] && zy[1].indexOf(fileDomain) === -1) {
          const file4 = new AV.File(`doctor_licence_${doctorid}.jpg`, {
            blob: {
              uri: zy[1],
            }
          })
          _file4 = await file4.save()
        }

        const doctor = AV.Object.createWithoutData('Doctor', doctorid)
        doctor.set('authenticated', '2')
        if (_file1) doctor.set('certificate1', _file1)
        if (_file2) doctor.set('certificate2', _file2)
        if (_file3) doctor.set('licence1', _file3)
        if (_file4) doctor.set('licence2', _file4)
        await doctor.save()
        Taro.hideLoading()
        Taro.showToast({
          title: '上传成功',
          duration: 1500
        })
        // 上传成功后重新获取数据并返回
        this.props.getDoctorData()
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } catch(e) {
        Taro.hideLoading()
        Taro.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      }
    } else {
      Taro.showToast({
        title: '请上传至少一种证书的正反面两张图片',
        icon: 'none'
      })
    }
  }

  render () {
    // const zg = 'https://6d65-mega-hzh-1258406532.tcb.qcloud.la/cydemo.jpg?sign=bbe3295f257bc7bae7f3ba1e885f45a4&t=1573192673'
    // const zy = 'https://6d65-mega-hzh-1258406532.tcb.qcloud.la/zjdemo.jpg?sign=5cb6336c69c209d017fea1dbd5d495e6&t=1573192687'
    const { authenticated, zg, zy } = this.state
    return (
      <View className='docauth'>
        <View className='tip-1'>通过认证后才能邀请患者和提供咨询哦。</View>
        <View className='tip-2'>
          <View className='tip-2-t'>上传您的资格证或执业证</View>
          <View className='tip-2-c'>* 请确保姓名、照片、编号、发证机关清晰可见。</View>
          <View className='tip-2-c'>* 上传的资料仅用于认证时使用，患者及第三方均不可见。</View>
        </View>
        <View className='licence'>医师资格证</View>
        <View className='licence-img'>
          {
            zg.length && zg.map((item, index) => (
              <View key={index} className='img'>
                <Image
                  mode='aspectFill'
                  src={item}
                  onClick={this.previewImage.bind(this, zg, item)}
                />
                <View className='preview' onClick={this.previewImage.bind(this, zg)}>点击预览</View>
                { authenticated != '2' && <View className='icon at-icon at-icon-close-circle' onClick={this.removeImage.bind(this, item, 'zg')}></View> }
              </View>
            ))
          }
          {
            zg.length < 2 && <Image
              mode='aspectFill'
              src={ADD_IMG}
              onClick={this.chooseImage.bind(this, 'zg')}
            />
          }
        </View>
        <View className='licence'>医生执业证</View>
        <View className='licence-img'>
          {
            zy.length && zy.map((item, index) => (
              <View key={index} className='img'>
                <Image
                  mode='aspectFill'
                  src={item}
                  onClick={this.previewImage.bind(this, zy, item)}
                />
                <View className='preview' onClick={this.previewImage.bind(this, zy)}>点击预览</View>
                { authenticated != '2' && <View className='icon at-icon at-icon-close-circle' onClick={this.removeImage.bind(this, item, 'zy')}></View> }
              </View>
            ))
          }
          {
            zy.length < 2 && <Image
              mode='aspectFill'
              src={ADD_IMG}
              onClick={this.chooseImage.bind(this, 'zy')}
            />
          }
        </View>
        <View className='tip-3'>可联系助手，提供资料让助手进行认证</View>
        <View class='btn'>
          {
            authenticated == '2'
            ? <Button disabled>审核中</Button>
            : <Button className='save' onClick={this.uploadImage.bind(this)}>{authenticated === '1' ? '更新' : '提交'}</Button>
          }
        </View>
      </View>
    )
  }
}

export default DoctorAuth
