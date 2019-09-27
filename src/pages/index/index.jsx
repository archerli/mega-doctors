import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super(...arguments)
    this.state = {
      current: 0
    }
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  toSettings() {
    Taro.navigateTo({
      url: '/pages/question/question'
    })
  }

  render () {
    const tabList = [{ title: '未回复' }, { title: '已回复' }]
    return (
      <View className='index'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)} style="overflow: auto;">
          <AtTabsPane current={this.state.current} index={0}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >
              <View style="height: 500px; background: #333;"></View>
              <View style="height: 500px; background: #555;"></View>
              <View style="height: 500px; background: #777;"></View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View style='height:100%;padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Index
