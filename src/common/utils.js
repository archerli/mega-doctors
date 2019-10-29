/*
 * @desc 存放项目中使用的公共方法
 */

import AV from 'leancloud-storage/live-query';
// import { APP } from './Constant';

class utils {
  // 格式化时间
  static formatTime(time, format = 'yyyy-MM-dd HH:mm:ss', showSingleNum = false) {
    if (!time || typeof time !== 'number') {
      return '';
    }

    const fixZero = function(num) {
      if (num < 10 && !showSingleNum) {
        return `0${num}`;
      }

      return num;
    };

    const timeObj = new Date(time);

    const fullYear = timeObj.getFullYear();
    const year = fullYear.toString().slice(2);
    const month = timeObj.getMonth() + 1;
    const day = timeObj.getDate();
    const hour = timeObj.getHours();
    const minute = timeObj.getMinutes();
    const second = timeObj.getSeconds();

    return format
      .replace(/yyyy/g, fullYear)
      .replace(/yy/g, year)
      .replace(/MM/g, fixZero(month))
      .replace(/dd/g, fixZero(day))
      .replace(/HH/g, fixZero(hour))
      .replace(/mm/g, fixZero(minute))
      .replace(/ss/g, fixZero(second));
  }

  // 路由切换时更新页面title信息
  static fixTitle(nextState) {
    const location = nextState.location;
    const pathname = location.pathname[0] === '/'
      ? location.pathname : `/${location.pathname}`;

    // 无参数URL匹配
    const currentPathKey = Object.keys(ROUTE_NAMES)
      .find(key => ROUTE_NAMES[key] === pathname);

    if (currentPathKey || currentPathKey === 0) {
      document.title = ROUTE_TITLES[currentPathKey];
    }
  }

  // 初始化AV对象
  static initAV(id, key) {
    AV.applicationId = undefined;
    AV.init({
      appId: id,
      appKey: key,
      serverURLs: 'https://avoscloud.com',
    });
    // return AV;
  }

}

export default utils
