import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtNoticebar } from "taro-ui"

import { add, minus, asyncAdd } from '../../actions/creator'
import QR from '../../common/weapp-qrcode.js'

import './QRCode.scss'

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

class QRCode extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true,
    backgroundColor: "#ececec"
  }

  constructor () {
    super(...arguments)
    this.state = {
      isIOS: false,
      imgData: ''
    }
  }

  componentDidMount() {
    const doctorid = Taro.getStorageSync('doctorid')
    const imgData = QR.drawImg(`http://megahealth.cn/followdoctor/index.html?id=${doctorid}`, {
      typeNumber: 4, // 码点大小 1-40，数字越大，码点越小，二维码会显得越密集
      errorCorrectLevel: 'M', // 纠错等级 H等级最高(30%) 简单来说，就是二维码被覆盖了多少仍然能被识别出来
      size: 500
    })
    this.setState({ imgData })
    Taro.getSystemInfo({
      success: res => {
        console.log(res)
        if (res.system.indexOf('iOS') > -1) {
          this.setState({ isIOS: true })
        }
      }
    })
  }

  save() {
    // const file = wx.getFileSystemManager()
    // const filePath = wx.env.USER_DATA_PATH + '/qrcode_' + '5daeb07b7b968a0074945056' + '.png'
    // // 写入临时文件
    // file.writeFile({
    //   filePath: filePath,
    //   data: this.state.imgData.slice(22),
    //   encoding: 'base64',
    //   success: res => {
    //     // 保存临时文件到手机相册中去
    //     wx.saveImageToPhotosAlbum({
    //       filePath,
    //       success: function(res) {
    //         Taro.showToast({
    //           title: '保存成功',
    //         })
    //       },
    //       fail: function(err) {
    //         console.log(err)
    //       }
    //     })
    //     console.log(res)
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
    return Taro.showToast({
      title: '开发中...',
      icon: 'none'
    })
    wx.setClipboardData({
      data: '页面未完成',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已复制您的二维码链接，请粘贴到浏览器打开',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  render () {
    const { imgData, isIOS } = this.state
    return (
      <View className='qrcode'>
        {
          !isIOS &&
          <View style='width:100%;position:fixed;top:0;'>
            <AtNoticebar close>添加到桌面，显示二维码更快哦</AtNoticebar>
          </View>
        }
        <View className='doc-tip'>让患者打开微信扫一扫</View>
        <View className='doc-tip'>关注我</View>
        <View className='qrc-img'>
          <Image src={imgData} />
        </View>
        <View className='pat-tip'>打开微信扫一扫关注医生</View>
        <View className='doc-tip'>扫码不会透露我的微信号或手机号</View>
        {
          isIOS &&
          <View className='btn' onClick={this.save.bind(this)}>把二维码添加到桌面</View>
        }
      </View>
    )
  }
}

export default QRCode
