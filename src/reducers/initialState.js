// 咨询列表
export const CONSULTATION = {
  current: 0,
  moreLoading: false,
  moreLoaded: false,
  newCons: null,
  replying: null,
  finished: null
}

// 问题详情
export const QUESTION = {
  relationId: null,
  tag: {"osahs":"0","cobp":"0","gxb":"0","tnb":"0","gxy":"0"}
}

// 患者列表
export const PATIENT = {
  current: 0,
  moreLoading: false,
  moreLoaded: false,
  vipList: [],
  paidList: [],
  followList: [],
  normalList: []
}

// 患者信息
export const PATIENT_INFO = {
  relationId: null,
  name: '',
  gender: '',
  birthday: '',
  phone: '',
  city: '',
  height: '',
  weight: '',
  follow: false,
  block: false,
  group: ["0"]
}

// 患者备注
export const REMARK = {
  relationId: null,
  tag: {"osahs":"0","cobp":"0","gxb":"0","tnb":"0","gxy":"0"},
  remark: ''
}

// 我的
export const MINE = {
  name: '',
  megaid: '',
  authenticated: 0,
  consultationNum: 0,
  patientNum: 0,
  credit: 0
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
  inputName: ''
}

// 设置
export const SETTING = {
  startConsultation: true,
  startConsultationTime: '',
  endConsultationTime: ''
}
