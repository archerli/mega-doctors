import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'

const action = (type, data) => {
  return { type, data }
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
        console.log(patient.id)
        switch (group) {
          case '1':
            vip.push({
              id: patient.id,
              name: patient.get('name'),
              icon: patient.get('HeadPortiat') && patient.get('HeadPortiat').replace(/[\r\n]/g, ''),
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
      dispatch(action(TYPES.GET_PATIENT_DATA, {
        name: patient.get('name'),
        gender: patient.get('gender'),
        birth: patient.get('birthday'),
        phone: '',
        city: '',
        height: patient.get('height'),
        weight: patient.get('weight')
      }))
    });
  }
}

// 获取医生数据
export const getDoctorData = () => {
  return dispatch => {
    var query = new AV.Query('Doctor');
    query.equalTo('name', '张医生');
    query.find().then(res => {
      console.log(res)
      dispatch(action(TYPES.GET_DOCTOR_DATA, res[0].attributes))
    });
  }
}
