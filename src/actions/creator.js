import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'
import utils from '../common/utils'

const action = (type, data) => {
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
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
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
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
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
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
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
        switch (group) {
          case '1':
            vip.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
              isVip: false,
              tag: []
            })
            break
          case '2':
            paid.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
              isVip: false,
              tag: []
            })
            break
          case '3':
            follow.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
              isVip: false,
              tag: []
            })
            break
          case '4':
            normal.push({
              id: patient && patient.id,
              name: patient && patient.get('name'),
              icon: patient && patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
              isVip: false,
              tag: []
            })
            break
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

// 修改医生关联患者信息
export const changeDoctorPatientData = (data) => {
  return {
    type: TYPES.CHANGE_DOCTOR_PATIENT_DATA,
    data
  }
}

// 获取患者数据
export const getPatientData = (patientId) => {
  return dispatch => {
    console.log(patientId);
    const query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', '5daeb07b7b968a0074945056'));
    query.equalTo('idPatient', AV.Object.createWithoutData('Patients', patientId));
    query.include('idPatient');
    query.find().then(res => {
      console.log(res)
      const patient = res[0].get('idPatient')
      console.log(patient)
      dispatch(action(TYPES.GET_PATIENT_DATA, {
        name: patient.get('name'),
        gender: patient.get('gender'),
        birthday: patient.get('birthday'),
        phone: '',
        city: '',
        height: patient.get('height'),
        weight: patient.get('weight'),
        follow: res[0].get('follow'),
        block: res[0].get('block')
      }))
    });
  }
}

// 获取医生数据
export const getDoctorData = (doctorid) => {
  return dispatch => {
    const query = new AV.Query('Doctor');
    // query.equalTo('name', '张医生');
    query.get(doctorid).then(res => {
      console.log(res)
      dispatch(action(TYPES.GET_DOCTOR_DATA, res.attributes))
    }, err => {
      console.log(err)
      Taro.removeStorageSync('userInfo')
      Taro.removeStorageSync('openid')
      Taro.removeStorageSync('doctorid')
      Taro.reLaunch({
        url: '../Auth/Auth'
      })
    })
  }
}

// 修改医生关联患者信息
export const changeDoctorData = (data) => {
  return {
    type: TYPES.CHANGE_DOCTOR_DATA,
    data
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
export const getDoctorPatientNum = () => {
  return dispatch => {
    const doctorid = Taro.getStorageSync('doctorid')
    const query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', doctorid));
    query.count().then(count => {
      console.log(count)
      dispatch(action(TYPES.GET_DOCTOR_PATIENT_NUM, count))
    });
  }
}

