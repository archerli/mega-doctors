## 概览

根据《兆观医生》产品需求文档，进行技术选型和设计。

## 服务端技术调研

### 微信服务开发

- Access-Token服务
- 小程序模板消息

### IM系统

#### 兆观助手

基于医生患者IM系统，增加「兆观官方助手」客服会话方。医生和患者方均可对其发起会话。

新建「客服」表，管理兆观官方助手。

第一阶段固定创建一个客服用户，医生患者通过固定ID发起会话。使用此ID登录网页版会话后台，进行一（客服）对多（多患者，多医生）回复。

第二阶段，客服分配功能。

……

### 短信服务

### 其他服务

- 医生微信邀请二维码生成



## 表结构设计

- **Patients** 患者信息表
- **Doctor** 医生信息表
- **Consultation** 医生患者咨询关系表
- **DoctorPatientRelation** 医生患者交互信息表

### Patients

| 字段     | 类型    | 描述 |
| -------- | ------- | ---- |
| objectId | Pointer | UID  |
| name     | String  | 姓名 |
| gender   | String  | 性别 |
| birthday | String  | 生日 |
| height   | String  | 身高 |
| weight   | String  | 体重 |
| phone    | String  | 联系电话 |
| icon     | File    | 头像 |
| location | String  | 用户位置，所在城市 |

### Doctor

| 字段     | 类型    | 描述         |
| -------- | ------- | ------------ |
| objectId | Pointer | UID          |
| openid   | String  | 小程序openid |
| name     | String  | 姓名 |
| gender   | String  | 性别 |
| phone    | String  | 联系电话 |
| avatar   | File    | 头像 |
| hospital | String  | 所在医院 |
| hospitalLevel | string | 0-9，三特到一丙 |
| skill | string | 擅长 |
| department | String | 所在科室 |
| title    | String  | 职称 |
| authenticated | String | 是否认证，0：否，1：是，2：认证中，3：未通过 |
| certificate1   | File    | 医师资格证 |
| certificate2   | File    | 医师资格证 |
| licence1  | File    | 医生执业证 |
| licence2  | File    | 医生执业证 |
| startConsultation     | Boolean | 是否开启咨询 |
| startConsultationTime | String  | 开启咨询时间 |
| endConsultationTime   | String  | 结束咨询时间 |
| description | string | 医生简介 |
| normalConsultingPrice | number | 普通咨询价格 |
| phoneConsultingPrice | number | 电话咨询价格 |
| isNormalConsultingOpen | boolean | 是否开启图文咨询 |
| isPhoneConsultingOpen | boolean | 是否开启电话咨询 |
| type | string | 类型 |
| isHomePageShow | boolean | 是否推荐首页展示 |

type：

- 空：常规医生
- 1：预约就诊
- 2：快速提问

hospitalLevel：

- 0：三级特等
- 1：三级甲等
- 2：三级乙等
- 3：三级丙等
- 4：二级甲等
- 5：二级乙等
- 6：二级丙等
- 7：一级甲等
- 8：一级乙等
- 9：一级丙等

### Consultation

| 字段     | 类型    | 描述     |
| -------- | ------- | -------- |
| objectId | Pointer | UID      |
| idDoctor | Pointer | 关联医生     |
| idPatient | Pointer | 关联患者     |
| idRelation | Pointer | 关联医患关系 |
| status   | String  | 咨询状态 |
| isInvalid | Boolean | 咨询是否失效 |
| idDialog | Pointer | 对话列表（IM系统，关联单次会话ID） |
| latestReportId | String | 最近一份报告id |
| type | string | 咨询类型 |

status:

- 0：新咨询
- 1：回复中
- 2：已结束

type(咨询类型):

- 0：图文资讯
- 1：电话咨询

对话列表：

```
[
  {
    content: String|File
    type: String
  }
]
```

type:

  - text: 文本类型
  - image: 图片类型
  - link: 链接类型

### DoctorPatientRelation

| 字段     | 类型    | 描述     |
| -------- | ------- | -------- |
| objectId | Pointer | UID      |
| idDoctor | Pointer | 关联医生   |
| idPatient | Pointer | 关联患者  |
| tag      | Array   | 标签 |
| remark   | String | 备注 |
| source | String | 用户来源 |
| follow | Boolean | 是否是医生特别关注的患者( vip patient ) |
| block | Boolean | 该患者是否被医生屏蔽 |
| group | Array | 分组 |
| credit | String | 贡献值 |
| showFollowedDoctorCard | Boolean | 患者登录app时，是否弹出患者最近关注的一位医生信息 |
| latestConsultationId | String | 最近一次咨询的 id |
| latestReportId | String | 最近一份报告的 id |

<!-- | latestConsultationTime | String | 最近咨询时间 | -->

group:

- 1：普通的
- 2：关注的
- ~~3：付费过~~
- ~~4：VIP患者~~

source：

- 0：扫码
- 1：线上

## 服务接口

### 创建咨询接口

**简要描述：** 

- 提供客户端调用的咨询创建接口，简化客户端请求。
- 获取医生咨询时段配置信息，判断是否可以推送通知。 
- 流程
  - 传入医生和患者id、咨询类型（图文、电话）、用户来源（扫码、线上等）
  - 获取医生咨询时段配置信息，判断是否可以给医生推送新用户咨询通知
  - 获取relationId，如不存在relation，则新建后返回（扫码方式先有relation后有会话，线上模式可能无relation）
  - 查询当前医生和患者是否有未关闭会话，如果没有则新建，并带上关系id（新建会话补充字段包括idDoctor\idPatient\idRelation\status\startAt\type）
  - 拿到咨询id，设置relation的curConsultation
  - 返回创建结果

**请求URL：** 

- ` https://api-mhn.megahealth.cn/1.1/functions/initiateConsultation `

**请求方式：**

- POST 

**header：** 

X-LC-Id: f82OcAshk5Q1J993fGLJ4bbs-gzGzoHsz

X-LC-Key: O9COJzi78yYXCWVWMkLqlpp8

Content-Type: application/json

X-LC-Prod: 0

 **请求体**

```
{
	"doctorId": "5daeb07b7b968a0074945056",
	"patientId": "5db2cf72f884af0073deb1bc"
}
```

 **请求体参数说明** 

| parameter | 类型   | describtion        |
| :-------- | :----- | ------------------ |
| doctorId  | string | 医生objectId       |
| patientId | string | 患者objectId       |
| type      | string | 咨询类型（非必填） |
| source    | string | 用户来源           |

 **返回**

```
{
    "result": {
        "success": true,
        "isOld": true,
        "status": "0",
        "startAt": 1574755900697
        "consultationId": "5dd7b98543c2570074c9d9bf"
    }
}
```

 **返回参数说明** 

| parameter      | 类型    | describtion                     |
| :------------- | :------ | ------------------------------- |
| consultationId | string  | 会话consultation objectId       |
| isOld          | boolean | 是否本次新创建的咨询            |
| status         | string  | 0：新咨询，1：咨询中，2：已关闭 |
| startAt        | number  | 咨询创建时间，时间戳（毫秒）    |

