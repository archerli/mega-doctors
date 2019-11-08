import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Input, Button, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider } from 'taro-ui'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import { Realtime, TextMessage } from 'leancloud-realtime/dist/realtime.weapp.min.js'

import { add, minus, asyncAdd } from '../../actions/creator'

import utils from '../../common/utils'
import MsgItem from '../../components/MsgItem/MsgItem'

import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import CLOCK from '../../assets/clock.png'

import './Question.scss'

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

class Question extends Component {

  config = {
    navigationBarTitleText: '',
    disableScroll: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      isFinished: false,
      tag1: '0',
      tag2: '0',
      tag3: '0',
      tag4: '0',
      tag5: '0',
      showRemark: true,
      scrollTop: 0,
      scrollIntoView: 'last-0',
      inputValue: '',
      msgList: [
        // {
        //   time: '2018/10/23 18:00',
        //   from: 'other',
        //   icon: QING,
        //   type: 'text',
        //   content: '张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好张医生您好'
        // },
        // {
        //   time: '2018/10/23 18:10',
        //   from: 'other',
        //   icon: QING,
        //   type: 'text',
        //   content: '张医生您好'
        // },
        // {
        //   time: '2018/10/23 18:20',
        //   from: 'other',
        //   icon: QING,
        //   type: 'image',
        //   content: 'http://megahealth.cn/asset/home/01.jpg',
        //   previewImage: this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/ring/pic_02.jpg'], 'http://megahealth.cn/asset/home/01.jpg')
        // },
        // {
        //   time: '2018/10/23 18:20',
        //   from: 'other',
        //   icon: QING,
        //   type: 'image',
        //   content: 'http://megahealth.cn/asset/ring/pic_02.jpg',
        //   previewImage: this.previewImage.bind(this, ['http://megahealth.cn/asset/home/01.jpg', 'http://megahealth.cn/asset/ring/pic_02.jpg'], 'http://megahealth.cn/asset/ring/pic_02.jpg')
        // },
        // {
        //   time: '2018/10/23 18:30',
        //   from: 'other',
        //   icon: QING,
        //   type: 'link',
        //   content: 'https%3A%2F%2Fyl-dev.megahealth.cn%2F%23%2Fhome%2Freport%2F5db0cd8fba39c80071bb5c02%3Ftype%3DnoLogo'
        // },
        // {
        //   time: '2018/10/23 19:00',
        //   from: 'self',
        //   icon: CLOCK,
        //   type: 'text',
        //   content: '好的'
        // }
      ]
    }
  }

  componentWillMount() {
    console.log(this.$router.params)
    const { params } = this.$router
    if (params && params.name) {
      Taro.setNavigationBarTitle({
        title: params.name
      })
    }

    const consultation = new AV.Query('Consultation')
    consultation.get(params.questionId).then(res => {
      console.log('consultation', res.get('status'))
      this.setState({
        isFinished: res.get('status') === '2'
      })
    }, err => {
      
    })
    // TODO
    // 拿到患者ID获取标签和备注信息


  }

  componentDidMount() {
    const { msgList } = this.state
    const { params } = this.$router
    const doctorid = Taro.getStorageSync('doctorid')
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
          members: [params.patientId],
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
      this.conversation = conversation
      this.messageIterator = conversation.createMessagesIterator();

      this.messageIterator
      .next()
      .then(result => {
        const data = result.value;
        console.log(data)
        const msgList = []
        data.forEach(item => {
          msgList.push({
            time: utils.formatTime(item._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
            from: item.from === doctorid ? 'self' : 'other',
            icon: item.from === doctorid ? Taro.getStorageSync('userInfo').avatarUrl : CLOCK,
            type: 'text',
            content: item.content._lctext
          })
        });
        this.setState({
          msgList,
          scrollIntoView: `last-${msgList.length - 1}`
        })
      })
      .catch(err => {
        console.log(err);
      });

      // 房间接受消息
      this.conversation.on('message', message => {
        console.log('接收到新消息')
        console.log(message)
        if (message.content && message.content._lctext) {
          const { msgList } = this.state
          msgList.push({
            time: utils.formatTime(message._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
            from: message.from === doctorid ? 'self' : 'other',
            icon: message.from === doctorid ? Taro.getStorageSync('userInfo').avatarUrl : CLOCK,
            type: 'text',
            content: message.content._lctext
          })
          this.setState({
            msgList,
            scrollIntoView: `last-${msgList.length - 1}`
          })
        }
      });
    })
    .catch(err => {
      console.log(err)
    });

  }

  toRemark() {
    Taro.navigateTo({
      url: '/pages/Remark/Remark'
    })
  }

  previewImage(urls, current) {
    Taro.previewImage({
      urls,
      current
    })
  }

  tagChange(id, e) {
    // console.log(id)
    // console.log(e.detail)
    this.setState({
      [`tag${id}`]: e.detail.value
    })
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
    this.conversation.send(new TextMessage(value)).then(message => {
      console.log('消息发送成功');

      const { params } = this.$router
      const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
      consultation.set('status', '1')
      consultation.save()

      const { msgList } = this.state
      msgList.push({
        time: utils.formatTime(new Date().getTime(), 'yyyy/MM/dd HH:mm'),
        from: 'self',
        icon: Taro.getStorageSync('userInfo').avatarUrl,
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

  onPageScroll(e) {
    // let { scrollTop } = e.detail
    // //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    // if (scrollTop <= 0) {
    //   scrollTop = 0;
    // } else if (scrollTop > Taro.getSystemInfoSync().windowHeight) {
    //   scrollTop = Taro.getSystemInfoSync().windowHeight;
    // }
    // //判断浏览器滚动条上下滚动
    // if (scrollTop > this.state.scrollTop || scrollTop == Taro.getSystemInfoSync().windowHeight) {
    //   this.setState({
    //     showRemark: true
    //   })
    //   //向下滚动
    // } else {
    //   this.setState({
    //     showRemark: false
    //   })
    //   //向上滚动
    // }
    // //给scrollTop重新赋值
    // setTimeout(() => {
    //   this.setState({
    //     scrollTop
    //   })
    // }, 0)
  }

  endQuestion() {
    if (this.state.isFinished) {
      return Taro.showToast({
        title: '本次咨询已结束',
        icon: 'none'
      })
    }
    Taro.showModal({
      title: '提示',
      content: '结束后不能继续发送消息，确定结束吗？',
      success: res => {
        if (res.confirm) {
          console.log('confirm')
          const { params } = this.$router
          const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
          consultation.set('endAt', new Date().getTime())
          consultation.set('status', '2')
          consultation.save().then(res => {
            Taro.showToast({
              title: '咨询已结束'
            })
            this.setState({
              isFinished: true
            })
          }, err => {
            Taro.showToast({
              title: '操作失败，请重试',
              icon: 'none'
            })
          })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  }

  render () {
    const { tag1, tag2, tag3, tag4, tag5, showRemark, msgList, scrollIntoView, inputValue } = this.state
    const tagRange = ['无', '轻度', '中度', '重度']
    return (
      <View className='question'>
        <View className='remark'>
          <View className='remark-1'>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 1)}>
              <View className={`tag-${tag1}`}>{tag1 === '0' ? 'OSAHS' : `OSAHS | ${tagRange[tag1].substr(0, 1)}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 2)}>
              <View className={`tag-${tag2}`}>{tag2 === '0' ? 'COBP' : `COBP | ${tagRange[tag2].substr(0, 1)}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 3)}>
              <View className={`tag-${tag3}`}>{tag3 === '0' ? '冠心病' : `冠心病 | ${tagRange[tag3].substr(0, 1)}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 4)}>
              <View className={`tag-${tag4}`}>{tag4 === '0' ? '糖尿病' : `糖尿病 | ${tagRange[tag4].substr(0, 1)}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} onChange={this.tagChange.bind(this, 5)}>
              <View className={`tag-${tag5}`}>{tag5 === '0' ? '高血压' : `高血压 | ${tagRange[tag5].substr(0, 1)}`}</View>
            </Picker>
          </View>
          <View className='remark-2'></View>
          <View className='remark-3'>
            <View className='btn' onClick={this.toRemark.bind(this)}>备注</View>
          </View>
        </View>
        <ScrollView
          className='msg'
          scrollY
          enableBackToTop
          scrollWithAnimation
          scrollIntoView={scrollIntoView}
          onScroll={this.onPageScroll.bind(this)}
        >
          <View style='height: 1px;'></View> {/* 上边距在 ScrollView 不满一屏时滚动，使用一个 1px 的元素占位 */}
          {
            msgList.map((item, index) => (
              <MsgItem
                id={`last-${index}`}
                key={index}
                time={item.time}
                from={item.from}
                icon={item.icon}
                type={item.type}
                content={item.content}
                previewImage={item.previewImage || (() => {})}
              />
            ))
          }
          {
            this.state.isFinished &&
            <AtDivider content='本次咨询已结束' fontColor='#E94F4F' lineColor='#E94F4F' />
          }
          <View style='height: 1px;'></View> {/* 下边距在 ScrollView 中不显示，使用一个 1px 的元素占位 */}
        </ScrollView>
        <View class='input'>
          <Input
            type='text'
            disabled={this.state.isFinished}
            confirmHold={true}
            // adjustPosition={false}
            value={inputValue}
            placeholder='患者在等待你的回复哦~'
            confirmType='send'
            onInput={this.inputMsg.bind(this)}
            onConfirm={this.sendMsg.bind(this)}
          />
          <Button onClick={this.endQuestion.bind(this)}>结束</Button>
        </View>
      </View>
    )
  }
}

export default Question
