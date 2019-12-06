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

import QING from '../../assets/qing.png'
import ZHONG from '../../assets/zhong.png'
import CLOCK from '../../assets/clock.png'
import DEFAULT_P from '../../assets/avatar-p.png'
import DEFAULT_D from '../../assets/avatar-d.png'

import './Question.scss'

@connect(({ question }) => ({
  question
}), (dispatch) => ({
  action(type, data) {
    dispatch(action(type, data))
  },
  getPatientData(patientId) {
    dispatch(getPatientData(patientId))
  },
  getPatientReportList(patientId) {
    dispatch(getPatientReportList(patientId))
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
      isLoading: true,
      isFinished: false,
      status: '',
      startTime: 0,
      endTime: 0,
      showRemark: true,
      scrollTop: 0,
      scrollIntoView: 'last-0',
      inputValue: '',
      pAvatar: DEFAULT_P,
      dAvatar: DEFAULT_D,
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
    const { patientId } = this.props.question
    if (params && params.name) {
      Taro.setNavigationBarTitle({
        title: params.name
      })
    }
    // 拿到患者ID获取标签/备注信息/报告列表
    this.props.getPatientData(params.patientId)
    if (params.patientId !== patientId) {
      this.props.getPatientReportList(params.patientId)
    }
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
  }

  async componentDidMount() {
    const { params } = this.$router
    const doctorid = Taro.getStorageSync('doctorid')
    await this.getAvatar(params.patientId, doctorid)
    await this.getConsultation(params.questionId)
    const { startTime, endTime, pAvatar, dAvatar, isFinished } = this.state
    const { question } = this.props
    console.log(startTime, endTime)
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
      // TODO: 根据开始时间和结束时间查询聊天记录
      this.conversation = conversation
      // 创建一个迭代器，用于消息分页
      // this.messageIterator = conversation.createMessagesIterator()

      // this.messageIterator
      // .next()
      conversation.queryMessages({
        startTime,
        endTime,
      })
      .then(result => {
        // const data = result.value;
        const data = result
        console.log(data)
        const msgList = []
        data.forEach(item => {
          msgList.push({
            timestamp: item._timestamp.getTime(),
            time: utils.formatTime(item._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
            from: item.from === doctorid ? 'self' : 'other',
            icon: item.from === doctorid ? dAvatar : pAvatar,
            type: 'text',
            content: item.content._lctext
          })
        });
        this.setState({
          msgList,
          scrollIntoView: `last-${msgList.length - 1}`
        }, () => {
          Taro.hideLoading()

          const restTime = 24 * 60 * 60 * 1000 - (new Date().getTime() - msgList[msgList.length - 1].timestamp)
          //////////
          if (!isFinished && restTime <= 0) {
            const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
            consultation.set('endAt', new Date().getTime())
            consultation.set('status', '2')
            consultation.set('lastMessage', msgList.length ? msgList[msgList.length - 1].content : '')
            consultation.save().then(res => {
              const query = new AV.Query('DoctorPatientRelation');
              query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
              query.equalTo('idPatient', AV.Object.createWithoutData('Patients', params.patientId));
              query.find().then(r => {
                console.log(r);
                const relationId = r[0].id
                const credit = r[0].get('credit')
                const relation = AV.Object.createWithoutData('DoctorPatientRelation', relationId)
                relation.set('credit', credit + 15)
                relation.save().then(res => {
                  Taro.showToast({
                    title: '本次咨询已失效',
                    icon: 'none'
                  })
                  this.setState({
                    isFinished: true
                  })
                })
              })
            }, err => {
              console.log(err)
            })
          }
          //////////

          if (!isFinished && restTime > 0) {
            // 房间接受消息
            conversation.on('message', message => {
              console.log('接收到新消息')
              console.log(message)
              if (message.content && message.content._lctext) {
                const { msgList } = this.state
                msgList.push({
                  time: utils.formatTime(message._timestamp.getTime(), 'yyyy/MM/dd HH:mm'),
                  from: message.from === doctorid ? 'self' : 'other',
                  icon: message.from === doctorid ? dAvatar : pAvatar,
                  type: 'text',
                  content: message.content._lctext
                })
                this.setState({
                  msgList,
                  scrollIntoView: `last-${msgList.length - 1}`
                })
              }
            });
          }

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

  getConsultation(id) {
    return new Promise((resolve, reject) => {
      const consultation = new AV.Query('Consultation')
      consultation.get(id).then(res => {
        console.log('consultation', res)
        console.log('consultation', res.get('status'))
        const status = res.get('status')
        const startTime = res.get('startAt')
        const endTime = res.get('endAt') || new Date().getTime()
        this.setState({
          isFinished: status === '2',
          status,
          startTime,
          endTime
        }, () => {
          resolve()
        })
      }, err => {
        console.log(err)
        reject(err)
      })
    })
  }

  toRemark() {
    const { params } = this.$router
    Taro.navigateTo({
      url: `/pages/Remark/Remark?patientId=${params.patientId}`
    })
  }

  toReport(e) {
    console.log(e.detail.value)
    const { reportList } = this.props.question
    const url = `https://raw.megahealth.cn/view#/parsemhn?objId=${reportList[e.detail.value].id}`
    Taro.navigateTo({
      url: `/pages/Webview/Webview?url=${encodeURIComponent(url)}`
    })
  }

  previewImage(urls, current) {
    Taro.previewImage({
      urls,
      current
    })
  }

  tagChange(key, e) {
    // console.log(key)
    // console.log(e.detail)
    const { question } = this.props
    const tag = {
      ...question.tag,
      [key]: e.detail.value
    }
    const relation = AV.Object.createWithoutData('DoctorPatientRelation', question.relationId)
    relation.set('tag', tag)
    relation.save().then(res => {
      // console.log(res)
      this.props.action(CHANGE_DOCTOR_PATIENT_TAG, res.get('tag'))
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

    //////////
    // const { isFinished, msgList } = this.state
    // if (!isFinished && (24 * 60 * 60 * 1000 - (new Date().getTime() - msgList[msgList.length - 1].timestamp)) <= 0) {
    //   const { params } = this.$router
    //   const doctorid = Taro.getStorageSync('doctorid')
    //   const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
    //   consultation.set('endAt', new Date().getTime())
    //   consultation.set('status', '2')
    //   consultation.set('lastMessage', msgList.length ? msgList[msgList.length - 1].content : '')
    //   consultation.save().then(res => {
    //     const query = new AV.Query('DoctorPatientRelation');
    //     query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    //     query.equalTo('idPatient', AV.Object.createWithoutData('Patients', params.patientId));
    //     query.find().then(r => {
    //       console.log(r);
    //       const relationId = r[0].id
    //       const credit = r[0].get('credit')
    //       const relation = AV.Object.createWithoutData('DoctorPatientRelation', relationId)
    //       relation.set('credit', credit + 15)
    //       relation.save().then(res => {
    //         Taro.showToast({
    //           title: '本次咨询已失效',
    //           icon: 'none'
    //         })
    //         this.setState({
    //           isFinished: true
    //         })
    //       })
    //     })
    //   }, err => {
    //     console.log(err)
    //   })
    // }
    //////////

    // 发送消息
    const { dAvatar } = this.state
    this.conversation.send(new TextMessage(value)).then(message => {
      console.log('消息发送成功');
      const { status, msgList } = this.state
      if (status === '0') {
        const { params } = this.$router
        const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
        consultation.set('status', '1')
        consultation.save()
      }
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
    const { isFinished, msgList } = this.state
    if (isFinished) {
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
          Taro.showLoading({
            title: '结束中...',
            mask: true
          })
          console.log('confirm')
          const { params } = this.$router
          const consultation = AV.Object.createWithoutData('Consultation', params.questionId)
          consultation.set('endAt', new Date().getTime())
          consultation.set('status', '2')
          consultation.set('lastMessage', msgList.length ? msgList[msgList.length - 1].content : '')
          consultation.save().then(res => {
            const doctorid = Taro.getStorageSync('doctorid')
            const query = new AV.Query('DoctorPatientRelation');
            query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
            query.equalTo('idPatient', AV.Object.createWithoutData('Patients', params.patientId));
            query.find().then(r => {
              console.log(r);
              const relationId = r[0].id
              const credit = r[0].get('credit')
              const relation = AV.Object.createWithoutData('DoctorPatientRelation', relationId)
              relation.set('credit', credit + 15)
              relation.save().then(res => {
                Taro.hideLoading()
                Taro.showToast({
                  title: '咨询已结束'
                })
                this.setState({
                  isFinished: true
                })
              })
            })
          }, err => {
            Taro.hideLoading()
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
    const { tag, reportList } = this.props.question
    const { params } = this.$router
    const { showRemark, msgList, scrollIntoView, inputValue } = this.state
    const tagRange = ['无', '轻度', '中度', '重度']
    const reports = reportList.map(item => `${item.date} ODI ${item.ODI} 最低${item.minO2}%`)
    return (
      <View className='question'>
        <View className='remark'>
          <View className='remark-1'>
            <Picker mode='selector' range={tagRange} value={tag.osahs} onChange={this.tagChange.bind(this, 'osahs')}>
              <View className={`tag-${tag.osahs}`}>{tag.osahs === '0' ? 'OSAHS' : `OSAHS | ${tagRange[tag.osahs].substr(0, 1)}`}</View>
            </Picker>
            <Picker mode='selector' range={tagRange} value={tag.cobp} onChange={this.tagChange.bind(this, 'cobp')}>
              <View className={`tag-${tag.cobp}`}>{tag.cobp === '0' ? 'COPD' : `COPD | ${tagRange[tag.cobp].substr(0, 1)}`}</View>
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
          <View className='remark-2'></View>
          <View className='remark-3'>
            {
              reportList.length
              ? <Picker mode='selector' range={reports} onChange={this.toReport.bind(this)}>
                <View className='btn'>报告</View>
              </Picker>
              : <View className='btn empty' onClick={() => Taro.showToast({ title: '没有历史报告', icon: 'none' })}>报告</View>
            }
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
                patientId={params.patientId}
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
          <Button onClick={this.endQuestion.bind(this)}>结束</Button>
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
        </View>
      </View>
    )
  }
}

export default Question
