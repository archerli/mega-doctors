import { combineReducers } from 'redux'
import {
  mine,
  myInfo,
  patient,
  patientInfo
} from './creator'

export default combineReducers({
  mine,
  myInfo,
  patient,
  patientInfo
})
