import AV from 'leancloud-storage/dist/av-weapp-min.js'
import * as TYPES from '../constants/creator'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

// 异步的action
export const asyncAdd = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}

const action = (type, data) => {
  return {
    type: type,
    payload: data
  }
}; 

export const getDoctorData = () => {
  return dispatch => {
    var query = new AV.Query('Doctor');
    query.equalTo('name', '张医生');
    query.find().then(res => {
      console.log(res)
      dispatch(action(TYPES.ADD, res[0].attributes))
      // students 是包含满足条件的 Student 对象的数组
    });
  }
}
