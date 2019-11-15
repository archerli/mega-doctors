import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'
import utils from '../common/utils'

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
export const getConsultationData = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('Consultation');
    query.descending('createdAt');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.include('idDoctor');
    query.include('idPatient');
    query.find().then(res => {
      console.log(res)
      const newCons = []
      const replying = []
      const finished = []
      res.forEach(item => {
        const status = item.get('status')
        const patient = item.get('idPatient')
        switch (status) {
          case '0':
            newCons.push({
              id: item.id,
              patientId: patient && patient.id,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              tag: [],
              time: utils.formatTime(item.createdAt.getTime(), 'yyyy/MM/dd HH:mm'),
              desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
            })
            break
          case '1':
            replying.push({
              id: item.id,
              patientId: patient && patient.id,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              tag: [],
              time: utils.formatTime(item.createdAt.getTime(), 'yyyy/MM/dd HH:mm'),
              desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
            })
            break
          case '2':
            finished.push({
              id: item.id,
              patientId: patient && patient.id,
              name: patient && patient.get('name'),
              isVip: false,
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              tag: [],
              time: utils.formatTime(item.createdAt.getTime(), 'yyyy/MM/dd HH:mm'),
              desc: '医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好医生你好'
            })
            break
        }
      });
      dispatch(action(TYPES.GET_CONSULTATION_DATA, {
        newCons,
        replying,
        finished
      }))
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
      console.log(res)
      const vip = []
      const paid = []
      const follow = []
      const normal = []
      res.forEach(item => {
        const group = item.get('group')
        const patient = item.get('idPatient')
        const source = item.get('source')
        let _source = ''
        if (source === '0') {
          _source = '扫码'
        }
        // 一个患者可能同时存在于多个分组，group 为 Array
        // 0普通 1VIP 2付费 3关注
        switch (true) {
          case group.indexOf('1') > -1:
            vip.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: [],
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime: '5天前'
            })
          case group.indexOf('2') > -1:
            paid.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: [],
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime: '5天前'
            })
          case group.indexOf('3') > -1:
            follow.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: [],
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime: '5天前'
            })
          case group.indexOf('0') > -1:
            normal.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('avatar') && patient.get('avatar').get('url'),
              isVip: false,
              tag: [],
              credit: item.get('credit'),
              source: _source,
              location: patient && patient.get('location'),
              lastTime: '5天前'
            })
        }
      });
      dispatch(action(TYPES.GET_DOCTOR_PATIENT_DATA, {
        vip,
        paid,
        follow,
        normal
      }))
    });
  }
}

// 获取患者数据
export const getPatientData = (patientId) => {
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
        phone: patient.get('user').get('mobilePhoneNumber'),
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
      console.log(res)
      if (res.length) {
        dispatch(action(TYPES.GET_DOCTOR_DATA, res[0].attributes))
      } else {
        Taro.removeStorageSync('userInfo')
        Taro.removeStorageSync('openid')
        Taro.removeStorageSync('doctorid')
        Taro.reLaunch({
          url: '../Auth/Auth'
        })
      }
    }, err => {
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

