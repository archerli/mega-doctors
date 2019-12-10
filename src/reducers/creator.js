import * as TYPES from '../constants/creator'
import * as STATES from './initialState'

// 咨询列表
export const consultation = (state = STATES.CONSULTATION, action) => {
  switch (action.type) {
    case TYPES.GET_CONSULTATION_DATA:
      // return {
      //   ...state,
      //   newCons: action.data.newCons,
      //   replying: action.data.replying,
      //   finished: action.data.finished
      // }
      return {
        ...state,
        ...action.data
      }
    case TYPES.SWIPER_CHANGE_INDEX:
      return {
        ...state,
        current: action.data
      }
    default:
      return state
  }
}

// 咨询列表
export const question = (state = STATES.QUESTION, action) => {
  switch (action.type) {
    case TYPES.GET_PATIENT_DATA:
      return {
        ...state,
        relationId: action.data.relationId,
        tag: action.data.tag
      }
    case TYPES.GET_PATIENT_REPORT_LIST:
      return {
        ...state,
        patientId: action.data.patientId,
        reportList: action.data.reportList
      }
    case TYPES.CHANGE_DOCTOR_PATIENT_TAG:
      return {
        ...state,
        tag: action.data
      }
    default:
      return state
  }
}

// 患者列表
export const patient = (state = STATES.PATIENT, action) => {
  switch (action.type) {
    case TYPES.GET_DOCTOR_PATIENT_DATA:
      return {
        ...state,
        vipList: action.data.vipList,
        paidList: action.data.paidList,
        followList: action.data.followList,
        normalList: action.data.normalList
      }
    case TYPES.SWIPER_CHANGE_PATIENT:
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
        relationId: action.data.relationId,
        name: action.data.name,
        gender: action.data.gender,
        birthday: action.data.birthday,
        phone: action.data.phone,
        city: action.data.city,
        height: action.data.height,
        weight: action.data.weight,
        follow: action.data.follow,
        block: action.data.block,
        group: action.data.group
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

// 患者备注
export const remark = (state = STATES.REMARK, action) => {
  switch (action.type) {
    case TYPES.GET_PATIENT_DATA:
      return {
        ...state,
        relationId: action.data.relationId,
        tag: action.data.tag,
        remark: action.data.remark
      }
    case TYPES.CHANGE_DOCTOR_PATIENT_TAG:
      return {
        ...state,
        tag: action.data
      }
    case TYPES.CHANGE_DOCTOR_PATIENT_REMARK:
      return {
        ...state,
        remark: action.data
      }
    default:
      return state
  }
}

// 患者备注
export const reportList = (state = STATES.REPORT_LIST, action) => {
  switch (action.type) {
    case TYPES.GET_PATIENT_REPORT_LIST:
      return {
        ...state,
        isLoading: false,
        patientId: action.data.patientId,
        reportList: action.data.reportList
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
        avatar: action.data.avatar,
        name: action.data.name,
        megaId: action.data.megaId,
        authenticated: action.data.authenticated,
      }
    case TYPES.CHANGE_DOCTOR_NAME:
      return {
        ...state,
        name: action.data.name
      }
    case TYPES.CHANGE_DOCTOR_AVATAR:
      return {
        ...state,
        avatar: action.data.avatar
      }
    case TYPES.GET_CONSULTATION_NUM:
      return {
        ...state,
        consultationNum: action.data
      }
    case TYPES.GET_DOCTOR_PATIENT_NUM:
      return {
        ...state,
        patientNum: action.data.patientNum,
        credit: action.data.credit
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
        avatar: action.data.avatar,
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
    case TYPES.CHANGE_DOCTOR_AVATAR:
      return {
        ...state,
        avatar: action.data.avatar
      }
    default:
      return state
  }
}

// 设置
export const setting = (state = STATES.SETTING, action) => {
  switch (action.type) {
    case TYPES.GET_DOCTOR_DATA:
      return {
        ...state,
        startConsultation: action.data.startConsultation,
        startConsultationTime: action.data.startConsultationTime,
        endConsultationTime: action.data.endConsultationTime
      }
    case TYPES.CHANGE_DOCTOR_SETTING:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
