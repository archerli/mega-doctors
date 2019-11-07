// 患者列表
export const PATIENT = {
  current: 0,
  moreLoading: false,
  moreLoaded: false,
  vip: [],
  paid: [],
  follow: [],
  normal: []
}

// 患者信息
export const PATIENT_INFO = {
  name: '',
  gender: '',
  birthday: '',
  phone: '',
  city: '',
  height: '',
  weight: '',
  follow: false,
  block: false
}

// 我的
export const MINE = {
  name: '',
  megaid: '',
  authenticated: 0,
}

// 个人信息
export const MY_INFO = {
  name: '',
  gender: '',
  hospital: '',
  department: '',
  title: '',
  phone: '',
  // 弹出层相关
  isOpened: false,
  placeholder: '',
  value: '',
  focus: false
}
