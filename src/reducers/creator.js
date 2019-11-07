import * as TYPES from '../constants/creator'

import * as STATES from './initialState'

// 患者列表
export const patient = (state = STATES.PATIENT, action) => {
  switch (action.type) {
    case TYPES.GET_DOCTOR_PATIENT_DATA:
      return {
        ...state,
        vip: action.data.vip,
        paid: action.data.paid,
        follow: action.data.follow,
        normal: action.data.normal
      }
    case TYPES.SWIPER_CHANGE:
      return {
        ...state,
        current: action.data
      }
    default:
      return state
  }
}

// 患者信息
export const patientInfo = (state = STATES.PATIENT_INFO, action) => {
  switch (action.type) {
    case TYPES.GET_PATIENT_DATA:
      return {
        ...state,
        name: action.data.name,
        gender: action.data.gender,
        birthday: action.data.birthday,
        phone: '',
        city: '',
        height: action.data.height,
        weight: action.data.weight,
        follow: action.data.follow,
        block: action.data.block
      }
    case TYPES.CHANGE_DOCTOR_PATIENT_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

// 我的
export const mine = (state = STATES.MINE, action) => {
  switch (action.type) {
    case TYPES.GET_DOCTOR_DATA:
      return {
        ...state,
        name: action.data.name,
        megaid: action.data.megaId,
        authenticated: action.data.authenticated,
      }
    case TYPES.CHANGE_DOCTOR_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

// 个人信息
export const myInfo = (state = STATES.MY_INFO, action) => {
  switch (action.type) {
    case TYPES.GET_DOCTOR_DATA:
      return {
        ...state,
        name: action.data.name,
        gender: action.data.gender,
        hospital: action.data.hospital,
        department: action.data.department,
        title: action.data.title,
        phone: action.data.phone
      }
    case TYPES.CHANGE_DOCTOR_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
