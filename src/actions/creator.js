import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'
import utils from '../common/utils'
import log from '../common/log'

import STAR from '../assets/star.png'
import MILD from '../assets/mild.png'
import MODERATE from '../assets/moderate.png'
import SEVERE from '../assets/severe.png'

// 通用
export const action = (type, data) => {
  return { type, data }
}

export const swiperChange = (type, current) => {
  return {
    type,
    data: current
  }
}

// 获取咨询列表数据
export const getConsultationData = (conversations, consultationStatus) => {
  return dispatch => {
    console.log('action.conversations', conversations)
    console.log('action.consultationStatus', consultationStatus)
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('Consultation');
    query.descending('endAt');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    if (consultationStatus) query.equalTo('status', consultationStatus);
    query.include('idDoctor');
    query.include('idPatient');
    query.include('idRelation');
    query.find().then(res => {
      log.info(`getConsultationData success: total ${res.length} consultations`)
      console.log(res)
      const newCons = []
      const replying = []
      const finished = []
      res.forEach(item => {
        const status = item.get('status')
        const patient = item.get('idPatient')
        const relation = item.get('idRelation')
        const patientId = patient && patient.id || ''
        // 获取最后一条消息
        let desc = ''
        let from = ''
        let time = ''
        let endHour = 0
        let endMin = 0
        if (status === '0' || status === '1') {
          if (conversations) {
            for (let i = 0; i < conversations.length; i++) {
              const c = conversations[i]
              if (c.members.indexOf(patientId) > -1) {
                const type = c.lastMessage && c.lastMessage.content && c.lastMessage.content._lctype
                if (type === -1 || type === 1) desc = c.lastMessage && c.lastMessage.content && c.lastMessage.content._lctext || ''
                if (type === -2) desc = '[图片]'
                from = c.lastMessage && c.lastMessage.from || ''
                time = c._lastMessageAt && c._lastMessageAt.getTime() || ''
                break
              }
            }
          }
          console.log(desc)
          // const restMin = parseInt((24 * 60 * 60 * 1000 - (new Date().getTime() - time)) / 1000 / 60)
          const startAt = item.get('startAt')
          const restMin = parseInt((24 * 60 * 60 * 1000 - (new Date().getTime() - startAt)) / 1000 / 60)
          // for test
          // const restMin = parseInt((2 * 60 * 60 * 1000 - (new Date().getTime() - time)) / 1000 / 60)
          endHour = parseInt(restMin / 60)
          endMin = restMin % 60
          if (endHour < 0) endHour = 0
          if (endMin < 0) endMin = 0
        }

        const source = relation && relation.get('source')
        const tag = relation && relation.get('tag') || []
        const follow = relation && relation.get('follow')
        // 患者来源
        let _source = ''
        if (source === '0') {
          _source = '扫码'
        }
        // 患者标签
        const _tag = []
        if (follow) _tag.push(STAR)
        const tagList = ['', MILD, MODERATE, SEVERE]
        let i = '0'
        for (let key in tag){
          if (tag[key] > i) i = tag[key]
        }
        if (i !== '0') _tag.push(tagList[i])
        // 0新咨询 1回复中 2已结束
        switch (status) {
          case '0':
            newCons.push({
              id: item.id,
              patientId,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url') || '',
              tag: _tag,
              timestamp: time,
              time: utils.formatTime(time, 'yyyy/MM/dd HH:mm'),
              desc,
              source: _source,
              location: patient && patient.get('location'),
              reportId: item.get('latestReportId') || '',
              endTime: endHour <= 0 ? `${endMin}分` : `${endHour}小时${endMin}分`
            })
            break
          case '1':
            replying.push({
              id: item.id,
              patientId,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url') || '',
              tag: _tag,
              timestamp: time,
              time: utils.formatTime(time, 'yyyy/MM/dd HH:mm'),
              desc,
              source: _source,
              location: patient && patient.get('location'),
              reportId: item.get('latestReportId') || '',
              // endTime: endHour <= 0 ? `${endMin}分` : `${endHour}小时${endMin}分`,
              lastMsgFrom: from === doctorid ? 'self' : 'other'
            })
            break
          case '2':
            finished.push({
              id: item.id,
              patientId,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url') || '',
              tag: _tag,
              time: utils.formatTime(item.get('endAt'), 'yyyy/MM/dd HH:mm'),
              desc: item.get('lastMessage'),
              source: _source,
              location: patient && patient.get('location'),
              reportId: item.get('latestReportId') || '',
              credit: item.get('credit')
            })
            break
        }
      });

      function sortByItem(itemName) {
        return function (object1, object2) {
          var value1 = object1[itemName];
          var value2 = object2[itemName];
          return value2 - value1
        }
      }
      // 新咨询和回复中 排序
      newCons.sort(sortByItem('timestamp'))
      const replying1 = []
      const replying2 = []
      replying.forEach(item => {
        if (item.lastMsgFrom === 'other') replying1.push(item)
        if (item.lastMsgFrom === 'self') replying2.push(item)
      })
      replying1.sort(sortByItem('timestamp'))
      replying2.sort(sortByItem('timestamp'))
      const _replying = [...replying1, ...replying2]

      if (consultationStatus === '0') {
        dispatch(action(TYPES.GET_CONSULTATION_DATA, {
          newCons
        }))
      } else if (consultationStatus === '1') {
        dispatch(action(TYPES.GET_CONSULTATION_DATA, {
          replying: _replying
        }))
      } else if (consultationStatus === '2') {
        dispatch(action(TYPES.GET_CONSULTATION_DATA, {
          finished
        }))
      } else {
        dispatch(action(TYPES.GET_CONSULTATION_DATA, {
          newCons,
          replying: _replying,
          finished
        }))
        Taro.hideLoading()
      }
    }, err => {
      log.error('getConsultationData failed')
      log.error(err)
      Taro.hideLoading()
    });
  }
}

// 获取医生关联患者数据
export const getDoctorPatientData = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.include('idDoctor');
    query.include('idPatient');
    query.find().then(res => {
      log.info(`getDoctorPatientData success: total ${res.length} relations`)
      console.log('DoctorPatientRelation', res)
      // const patientIdList = []

      // res.forEach(item => {
      //   const patient = item.get('idPatient')
      //   patientIdList.push(patient && patient.id)
      // });
      //////////
      const consultationList = []
      const consultation = new AV.Query('Consultation');
      consultation.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
      consultation.descending('createdAt');
      consultation.find().then(c => {
        console.log('consultation', c)
        c.forEach(item => {
          const consultationId = item.id
          const patientId = item.get('idPatient').id
          consultationList.push({
            patientId,
            consultationId,
            reportId: item.get('latestReportId') || '',
            time: item.createdAt
          })
        });

        //////////
        const normalList = []
        const vipList = []
        const paidList = []
        const followList = []
        res.forEach(item => {
          const group = item.get('group')
          const patient = item.get('idPatient')
          const source = item.get('source')
          const tag = item.get('tag')
          const follow = item.get('follow')
          const patientId = patient && patient.id || ''
          // patientIdList.push(patient && patient.id)
          // console.log(patientIdList)
          // 患者来源
          let _source = ''
          if (source === '0') {
            _source = '扫码'
          }
          if (source === '1') {
            _source = '线上'
          }
          // 患者标签
          const _tag = []
          if (follow) _tag.push(STAR)
          const tagList = ['', MILD, MODERATE, SEVERE]
          let i = '0'
          for (let key in tag){
            if (tag[key] > i) i = tag[key]
          }
          if (i !== '0') _tag.push(tagList[i])

          // 最后咨询时间
          let lastTime = '无'
          let latestConsultationId = ''
          let latestReportId = ''
          for (let i = 0; i < consultationList.length; i++) {
            const c = consultationList[i]
            if (c.patientId === patientId) {
              const time = (new Date().getTime() - c.time.getTime()) / 1000
              if (parseInt(time / 60 / 60 / 24) >= 1) {
                lastTime = `${parseInt(time / 60 / 60 / 24)}天前`
              } else if (parseInt(time / 60 / 60) >= 1) {
                lastTime = `${parseInt(time / 60 / 60)}小时前`
              } else if (parseInt(time / 60) >= 1) {
                lastTime = `${parseInt(time / 60)}分钟前`
              }
              latestConsultationId = c.consultationId
              latestReportId = c.reportId
              break
            }
          }
          // 一个患者可能同时存在于多个分组，group 为 Array
          // 0普通 1VIP 2付费 3关注
          if (group.indexOf('0') > -1) {
            normalList.push({
              id: patientId,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: _tag,
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime,
              latestConsultationId,
              latestReportId
            })
          }
          if (group.indexOf('1') > -1) {
            vipList.push({
              id: patientId,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: true,
              tag: _tag,
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime,
              latestConsultationId,
              latestReportId
            })
          }
          if (group.indexOf('2') > -1) {
            paidList.push({
              id: patientId,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: _tag,
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime,
              latestConsultationId,
              latestReportId
            })
          }
          if (group.indexOf('3') > -1) {
            followList.push({
              id: patientId,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: _tag,
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime,
              latestConsultationId,
              latestReportId
            })
          }
        });
        dispatch(action(TYPES.GET_DOCTOR_PATIENT_DATA, {
          vipList,
          paidList,
          followList,
          normalList
        }))
        //////////

      })
      //////////

    }, err => {
      log.error('getDoctorPatientData failed')
      log.error(err)
    });
  }
}

// 获取患者数据
export const getPatientData = patientId => {
  return dispatch => {
    console.log(patientId);
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.equalTo('idPatient', AV.Object.createWithoutData('Patients', patientId));
    query.include('idPatient');
    query.include('idPatient.user');
    query.find().then(res => {
      console.log(res)
      const patient = res[0].get('idPatient')
      console.log(patient)
      dispatch(action(TYPES.GET_PATIENT_DATA, {
        relationId: res[0].id,
        name: patient.get('name'),
        gender: patient.get('gender'),
        birthday: patient.get('birthday'),
        phone: patient.get('user') && patient.get('user').get('mobilePhoneNumber'),
        city: patient.get('location'),
        height: patient.get('height'),
        weight: patient.get('weight'),
        follow: res[0].get('follow'),
        block: res[0].get('block'),
        source: res[0].get('source'),
        group: res[0].get('group'),
        tag: res[0].get('tag'),
        remark: res[0].get('remark')
      }))
    });
  }
}

// 获取患者报告列表
export const getPatientReportList = (patientId, showLoading = false) => {
  return dispatch => {
    if (showLoading) {
      dispatch(action(TYPES.GET_PATIENT_REPORT_LIST_START, {
        isLoading: true
      }))
    }
    console.log(patientId);
    const query0 = new AV.Query('RingSport');
    query0.equalTo('dataType', 0);
    const query1 = new AV.Query('RingSport');
    query1.equalTo('dataType', 1);
    const query = AV.Query.or(query0, query1);
    query.equalTo('userInfoPointer', AV.Object.createWithoutData('Patients', patientId));
    query.greaterThan('duration', 0);
    query.exists('downIndex');
    query.descending('createdAt');
    query.limit(1000);
    query.select([
      'minO2',
      'downIndex',
      'duration',
      'downTimes'
    ]);
    query.count()
    query.find().then(res => {
      console.log('getPatientReportsData:reports', res)
      const reportList = []
      res.forEach(item => {
        reportList.push({
          id: item.id,
          minO2: item.get('minO2') && item.get('minO2').toFixed(1),
          ODI: item.get('downIndex') && item.get('downIndex').toFixed(1),
          date: utils.formatTime(item.createdAt.getTime(), 'yyyy-MM-dd'),
          duration: item.get('duration'),
          downTimes: item.get('downTimes')
        })
      })
      // 同一天多份报告取时间最长的一份
      let _reportList = []
      for (let i = 0; i < reportList.length; i++) {
        if (i === 0) {
          _reportList.push(reportList[0])
        }
        if (i > 0) {
          if (reportList[i].date === reportList[i - 1].date) {
            if (reportList[i].duration > reportList[i - 1].duration) {
              _reportList[_reportList.length - 1] = reportList[i]
            }
          } else {
            _reportList.push(reportList[i])
          }
        }
      }
      console.log('_reportList', _reportList)
      dispatch(action(TYPES.GET_PATIENT_REPORT_LIST, {
        patientId,
        reportList: _reportList
      }))
      if (showLoading) Taro.hideLoading()
    }, err => {
      if (showLoading) Taro.hideLoading()
    })
  }
}

// 获取医生数据
export const getDoctorData = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('Doctor')
    query.equalTo('objectId', doctorid)
    // query.get(doctorid).then(res => {
    //   console.log(res)
    //   dispatch(action(TYPES.GET_DOCTOR_DATA, res.attributes))
    // }, err => {
    //   console.log(err)
    //   Taro.removeStorageSync('userInfo')
    //   Taro.removeStorageSync('openid')
    //   Taro.removeStorageSync('doctorid')
    //   Taro.reLaunch({
    //     url: '../Auth/Auth'
    //   })
    // })
    query.find().then(res => {
      log.info('getDoctorData success')
      console.log(res)
      if (res.length) {
        const r = res[0]
        dispatch(action(TYPES.GET_DOCTOR_DATA, {
          avatar: r.get('avatar') && r.get('avatar').get('url'),
          name: r.get('name'),
          megaId: r.get('megaId'),
          authenticated: r.get('authenticated'),
          gender: r.get('gender'),
          hospital: r.get('hospital'),
          department: r.get('department'),
          title: r.get('title'),
          phone: r.get('phone'),
          skill: r.get('skill'),
          description: r.get('description'),
          startConsultation: r.get('startConsultation'),
          startConsultationTime: r.get('startConsultationTime'),
          endConsultationTime: r.get('endConsultationTime'),
          normalConsultingPrice: r.get('normalConsultingPrice'),
          phoneConsultingPrice: r.get('phoneConsultingPrice'),
          isNormalConsultingOpen: r.get('isNormalConsultingOpen'),
          isPhoneConsultingOpen: r.get('isPhoneConsultingOpen')
        }))
      } else {
        Taro.removeStorageSync('userInfo')
        Taro.removeStorageSync('openid')
        Taro.removeStorageSync('doctorid')
        // Taro.reLaunch({
        //   url: '../Auth/Auth'
        // })
      }
    }, err => {
      log.error('getDoctorData failed')
      log.error(err)
      console.log(err)
    })
  }
}

// 获取咨询数量
export const getConsultationNum = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('Consultation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.count().then(count => {
      console.log(count)
      dispatch(action(TYPES.GET_CONSULTATION_NUM, count))
    });
  }
}

// 获取患者数量
export const getDoctorPatientNumAndCredit = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.find().then(res => {
      console.log(res)
      let credit = 0;
      res.forEach(item => {
        credit += item.get('credit')
      });
      dispatch(action(TYPES.GET_DOCTOR_PATIENT_NUM, {
        patientNum: res.length,
        credit
      }))
    });
  }
}

