import Taro, { Component } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import WeCropper from '../../common/we-cropper.min.js'

import { action, getDoctorData } from '../../actions/creator'
import { CHANGE_DOCTOR_AVATAR } from '../../constants/creator'

import './Avatar.scss'

@connect(({}) => ({

}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getDoctorData() {
    dispatch(getDoctorData())
  }
}))

class Avatar extends Component {

  config = {
    // navigationBarBackgroundColor: "#000000",
    navigationBarTitleText: '更换头像',
    disableScroll: true,
    backgroundColor: "#ffffff"
  }

  constructor () {
    super(...arguments)
    const device = Taro.getSystemInfoSync() // 获取设备信息
    const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
    const height = device.windowHeight
    this.cropperOpt = {
      src: this.$router.params.avatarUrl,
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 300) / 2, // 裁剪框x轴起点
        y: (height - 330) / 2, // 裁剪框y轴期起点
        width: 300, // 裁剪框宽度
        height: 300 // 裁剪框高度
      },
      boundStyle: {
        mask: 'rgba(0, 0, 0, 0.8)'
      }
    }
  }

  componentDidMount() {
    this.cropper = new WeCropper(this.cropperOpt)
      .on('ready', ctx => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', ctx => {
        Taro.showLoading({
          title: '上传中',
          mask: true
        })
      })
      .on('imageLoad', ctx => {
        Taro.hideLoading()
      })
  }

  chooseImage() {
    Taro.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setState({
          avatarUrl: tempFilePaths
        })
      }
    })
  }

  touchStart(e) {
    this.cropper.touchStart({
      touches: e.touches.filter(i => i.x !== undefined)
    })
  }

  touchMove(e) {
    this.cropper.touchMove({
      touches: e.touches.filter(i => i.x !== undefined)
    })
  }

  touchEnd(e) {
    this.cropper.touchEnd()
  }

  async getCropperImage() {
    Taro.showLoading({
      title: '正在上传头像',
      mask: true
    })
    try {
      const tempFilePath = await this.cropper.getCropperImage({ fileType: 'jpg' })
      const doctorid = Taro.getStorageSync('doctorid')
      console.log(tempFilePath)
      const file = new AV.File(`doctor_avatar_${doctorid}.jpg`, {
        blob: {
          uri: tempFilePath,
        }
      })
      const _file = await file.save()
      const doctor = AV.Object.createWithoutData('Doctor', doctorid)
      doctor.set('avatar', _file)
      const avatar = await doctor.save()
      console.log('avatar', avatar.get('avatar') && avatar.get('avatar').get('url'))
      Taro.hideLoading()
      Taro.showToast({
        title: '上传成功',
        duration: 1500
      })
      // 上传成功后重新获取数据并返回
      // this.props.getDoctorData()
      this.props.action(CHANGE_DOCTOR_AVATAR, {
        avatar: avatar.get('avatar') && avatar.get('avatar').get('url')
      })
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
    // const tempFilePath = this.cropper.getCropperImage(tempFilePath => {
    //   // tempFilePath 为裁剪后的图片临时路径
    //   if (tempFilePath) {
    //     console.log('if', tempFilePath)
    //     const doctorid = Taro.getStorageSync('doctorid')
    //     const file = new AV.File(`doctor_avatar.png`, tempFilePath)
    //     file.save().then(file => {
    //       console.log('文件保存完成。objectId：' + file.id);
    //     }, err => {
    //       Taro.hideLoading()
    //       Taro.showToast({
    //         title: '上传失败，请重试',
    //         icon: 'none'
    //       })
    //       // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
    //     });
    //   } else {
    //     console.log('else', tempFilePath)
    //     Taro.hideLoading()
    //     // Taro.showToast({
    //     //   title: '获取图片地址失败，请重试',
    //     //   icon: 'none'
    //     // })
    //   }
    // })
   }

  render () {
    const { id, targetId, pixelRatio, width, height } = this.cropperOpt
    return (
      <View className='avatar'>
        {/* <Image mode='widthFix' src={avatarUrl} onClick={this.chooseImage.bind(this)} /> */}
        <Canvas
          className="cropper"
          disable-scroll={true}
          ontouchstart={this.touchStart.bind(this)}
          ontouchmove={this.touchMove.bind(this)}
          ontouchend={this.touchEnd.bind(this)}
          style={`width:${width}px;height:${height}px;background-color: rgba(0, 0, 0, 0.8);`}
          canvas-id={id}
        >
        </Canvas>
        <Canvas
          className="cropper"
          disable-scroll={true}
          style={`position:fixed;top:-${width*pixelRatio}px;left:-${height*pixelRatio}px;width:${width*pixelRatio}px;height:${height*pixelRatio}px;`}
          canvas-id={targetId}
        >
        </Canvas>
        <View className='confirm'>
          <View onClick={this.getCropperImage.bind(this)}>完成</View>
        </View>
      </View>
    )
  }
}

export default Avatar
