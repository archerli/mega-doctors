import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Input, Button, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider } from 'taro-ui'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import { Realtime, TextMessage } from 'leancloud-realtime/dist/realtime.weapp.min.js'

import { action, getPatientData, getPatientReportList } from '../../actions/creator'
import { CHANGE_DOCTOR_PATIENT_TAG } from '../../constants/creator'

import utils from '../../common/utils'
import MsgItem from '../../components/MsgItem/MsgItem'

import DEFAULT_P from '../../assets/avatar-p.png'
import DEFAULT_D from '../../assets/avatar-d.png'

import './Service.scss'

@connect(({ mine }) => ({
  mine
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  }
}))

class Service extends Component {

  config = {
    navigationBarTitleText: '我的兆观助手',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      scrollIntoView: 'last-0',
      inputValue: '',
      pAvatar: DEFAULT_P,
      dAvatar: DEFAULT_D,
      msgList: [],
      imgList: []
    }
  }

  componentWillMount() {
    this.setState({
      dAvatar: this.props.mine.avatar
    })
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
  }

  async componentDidMount() {
    const doctorid = Taro.getStorageSync('doctorid')
    const { pAvatar, dAvatar } = this.state
    const realtime = new Realtime({
      appId: 'f82OcAshk5Q1J993fGLJ4bbs-gzGzoHsz',
      appKey: 'O9COJzi78yYXCWVWMkLqlpp8',
      server: 'api-mhn.megahealth.cn',
      plugins: AV.TypedMessagesPlugin // 注册富媒体消息插件
    });
    // Tom 用自己的名字作为 clientId 来登录即时通讯服务
    realtime.createIMClient(doctorid)
    .then(client => {
      // 成功登录
      this.client = client
      return client.getConversation(doctorid)
    })
    .then(conversation => {
      if (conversation) {
        return conversation;
      } else {
        // 如果服务器端不存在这个 conversation
        console.log('不存在这个 conversation，创建一个。');
        // 创建与 Jerry 之间的对话
        return this.client.createConversation({ // client 是一个 IMClient 实例
          // 指定对话的成员除了当前用户 Tom（SDK 会默认把当前用户当做对话成员）之外，还有 Jerry
          members: ['5de8b498dd3c13007fcff000'],
          // 对话名称
          name: 'Tom & Jerry',
          unique: true
        }).then(conversation => {
          console.log(conversation)
          return conversation
        })
      }
    })
    // .then(conversation => {
    //   return conversation.join()
    // })
    .then(conversation => {
      // 获取聊天历史
      // TODO: 根据开始时间和结束时间查询聊天记录
      this.conversation = conversation
      // 创建一个迭代器，用于消息分页
      // this.messageIterator = conversation.createMessagesIterator()

      // this.messageIterator
      // .next()
      conversation.queryMessages()
      .then(result => {
        // const data = result.value;
        const data = result
        console.log(data)
        const msgList = []
        const imgList = []
        data.forEach(item => {
          const content = item.content || {}
          const type = content._lctype // -1文本 -2图片
          if (type === -2) {
            imgList.push(content._lcfile && content._lcfile.url)
          }
          msgList.push({
            timestamp: item._timestamp.getTime(),
            time: utils.formatTime(item._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
            from: item.from === doctorid ? 'self' : 'other',
            icon: item.from === doctorid ? dAvatar : pAvatar,
            type: type === -2 ? 'image' : 'text',
            content: type === -2 ? content._lcfile && content._lcfile.url : content._lctext
          })
        });
        this.setState({
          msgList,
          imgList
        }, () => {
          setTimeout(() => {
            Taro.hideLoading()
            this.setState({
              scrollIntoView: `last-${msgList.length - 1}`
            })
          }, 300)
          // 房间接受消息
          conversation.on('message', message => {
            console.log('接收到新消息')
            console.log(message)
            const content = message.content || {}
            const type = content._lctype // -1文本 -2图片
            if (type === -1 || type === -2) {
              const { msgList, imgList } = this.state
              if (type === -2) {
                imgList.push(content._lcfile && content._lcfile.url)
              }
              msgList.push({
                time: utils.formatTime(message._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
                from: message.from === doctorid ? 'self' : 'other',
                icon: message.from === doctorid ? dAvatar : pAvatar,
                type: type === -2 ? 'image' : 'text',
                content: type === -2 ? content._lcfile && content._lcfile.url : content._lctext
              })
              this.setState({
                msgList,
                imgList,
                scrollIntoView: `last-${msgList.length - 1}`
              })
            }
          });
        })
      })
      .catch(err => {
        Taro.hideLoading()
        Taro.showToast({
          title: '会话获取失败，请重试',
          icon: 'none'
        })
        console.log(err);
      });
    })
    .catch(err => {
      Taro.hideLoading()
      Taro.showToast({
        title: '会话获取失败，请重试',
        icon: 'none'
      })
      console.log(err)
    });

  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.client.close()
  }

  getAvatar(patientId, doctorId) {
    const p1 = new Promise((resolve, reject) => {
      const patient = new AV.Query('Patients')
      patient.get(patientId).then(res => {
        console.log('patient', res)
        this.setState({
          pAvatar: res.get('avatar') && res.get('avatar').get('url') || DEFAULT_P
        }, () => {
          resolve()
        })
      }, err => {
        console.log(err)
        resolve()
      })
    })

    const p2 = new Promise((resolve, reject) => {
      const doctor = new AV.Query('Doctor')
      doctor.get(doctorId).then(res => {
        console.log('doctor', res)
        this.setState({
          dAvatar: res.get('avatar') && res.get('avatar').get('url') || DEFAULT_D
        }, () => {
          resolve()
        })
      }, err => {
        console.log(err)
        resolve()
      })
    })

    return Promise.all([p1, p2])
  }

  inputMsg(e) {
    // console.log(e.detail.value)
    this.setState({
      inputValue: e.detail.value
    })
  }

  sendMsg(e) {
    // console.log(e)
    const value = e.detail.value
    if (!value) return

    // 发送消息
    const { dAvatar } = this.state
    this.conversation.send(new TextMessage(value)).then(message => {
      console.log('消息发送成功');
      const { msgList } = this.state
      msgList.push({
        time: utils.formatTime(new Date().getTime(), 'yyyy/MM/dd HH:mm'),
        from: 'self',
        icon: dAvatar,
        type: 'text',
        content: e.detail.value
      })
      this.setState({
        msgList,
        scrollIntoView: `last-${msgList.length - 1}`,
        inputValue: ''
      })
    }).catch(err => {
      console.log(err)
      Taro.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      })
    });
  }

  previewImage(urls, current) {
    Taro.previewImage({
      urls,
      current
    })
  }

  render () {
    const { params } = this.$router
    const { msgList, imgList, scrollIntoView, inputValue } = this.state
    return (
      <View className='service'>
        <View className='msg-title'>周一至周五 9:30~18:30 在线，其他时间请留言</View>
        <ScrollView
          className='msg'
          scrollY
          enableBackToTop
          scrollWithAnimation
          scrollIntoView={scrollIntoView}
        >
          <View style='height: 1px;'></View> {/* 上边距在 ScrollView 不满一屏时滚动，使用一个 1px 的元素占位 */}
          {
            msgList.map((item, index) => (
              <MsgItem
                id={`last-${index}`}
                patientId={params.patientId}
                key={index}
                time={item.time}
                from={item.from}
                icon={item.icon}
                type={item.type}
                content={item.content}
                previewImage={this.previewImage.bind(this, imgList, item.content)}
              />
            ))
          }
          <View style='height: 1px;'></View> {/* 下边距在 ScrollView 中不显示，使用一个 1px 的元素占位 */}
        </ScrollView>
        <View class='input'>
          <Input
            type='text'
            confirmHold={true}
            // adjustPosition={false}
            value={inputValue}
            placeholder='在此输入您的问题'
            confirmType='send'
            onInput={this.inputMsg.bind(this)}
            onConfirm={this.sendMsg.bind(this)}
          />
        </View>
      </View>
    )
  }
}

export default Service
