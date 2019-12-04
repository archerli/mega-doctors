import { combineReducers } from 'redux'
import {
  mine,
  myInfo,
  patient,
  patientInfo,
  consultation,
  question,
  remark,
  setting,
  reportList
} from './creator'

export default combineReducers({
  mine,
  myInfo,
  patient,
  patientInfo,
  consultation,
  question,
  remark,
  setting,
  reportList
})
