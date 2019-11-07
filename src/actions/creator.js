import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'

const action = (type, data) => {
  return { type, data }
}

export const swiperChange = (current) => {
  return {
    type: TYPES.SWIPER_CHANGE,
    data: current
  }
}

// 获取医生关联患者数据
export const getDoctorPatientData = () => {
  return dispatch => {
    var query = new AV.Query('DoctorPatientRelation');
    query.equalTo('idDoctor', AV.Object.createWithoutData('Doctor', '5daeb07b7b968a0074945056'));
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
            paid.push(item.attributes)
            break
          case '3':
            follow.push(item.attributes)
            break
          case '4':
            normal.push(item.attributes)
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
    var query = new AV.Query('DoctorPatientRelation');
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
    var query = new AV.Query('Doctor');
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
