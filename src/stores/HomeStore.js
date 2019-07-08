import { observable, action, toJS, } from 'mobx';
import { isDataExist } from 'Utils/dataTools';
import * as services from '../services/home';
import { isEmpty, uniqBy, } from 'lodash';
import { checkCurrentMenu } from 'utils/dataTools';
import { MenuObj,  } from '../constants/configs';
const uuid = require('uuid/v1');

class Home {
  @observable contentScrollHeight = 0; //当前content滚动高度
  @observable collapsed = false;
  @observable menuObj = MenuObj.leafMenuModels;
  @observable openKeys = ['1']; // 菜单初始化默认打开的key数组
  @observable selectedKeys = ['101']; // 菜单初始化默认选中的key数组
  @observable crumbsList = []; // 全局crumbs需求
  @observable size_class = '';
  @observable isClickCollapsed = false;
  @observable isRecommend = true; // 是否需要推荐菜单
  @observable customMenu = [];// 首页自定义菜单
  @observable isLoading = false;
  @observable toggledActionId = 0;
  @observable addInfo = []//首页工单信息;
  @observable workInfo = []//首页人员维修;
  @observable staffInfo = []//首页人员维修;
  @observable devInfo = []//首页人员维修;
  @observable isAuth = false

  
  /* 首页初始化获取菜单信息 */
  @action async getMenuList() {
    let menuObj = toJS(this.menuObj);
    try {
      let res = await services.gets('getMenuList')();
      if (isDataExist(res)) {
        let data = res.data.data.children;
        /* 一级菜单 */
        menuObj.map(lv => {
          Object.assign(lv, {
            id: uuid(),
            displayNone: true
          });
          data.map(item => {
            if (lv.name === item.text) {
              if (item.children) {
                lv.children = item.children;
              }
              Object.assign(lv, {
                id: item.id,
                displayNone: false
              });
            }
          })
        })
        /* 二级菜单 */
        menuObj.map(lv => {
          if (!lv.displayNone) {
            lv.leafMenuModels.map(lv2 => {
              Object.assign(lv2, {
                id: uuid(),
                displayNone: false
              });
              lv.children.map(item => {
                if (item.parentId === lv.id) {
                  if (item.text === lv2.name) {
                    Object.assign(lv2, {
                      id: item.id,
                      displayNone: false
                    })
                  }
                }
              })
            })
          }

        })
        this.isAuth = !isEmpty(data);
        this.menuObj = menuObj;
        /* 设置当前登录页面 */
        let current = {
          id: -1, parentId: -1
        }
        data.map(item => {
          if (current.id > 0) return;
          if (!isEmpty(item.children)) {
            current = item.children[0]
          }
        })
        menuObj.map(lv => {
          if (lv.id === current.parentId) {
            current.url = lv.leafMenuModels.filter(lv2 => lv2.id === current.id)[0].path
          }
        })
        return current.url
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* 菜单加载的初始化 */
  @action initMenu(pathname) {
    try {
      let menuObj = toJS(this.menuObj);
      let currentMenu = [], crumbsList = [];
      /* 菜单查询 */
      currentMenu = menuObj.filter(leaf => leaf.path === pathname)[0];
      if (isEmpty(currentMenu)) {
        menuObj.map(lv => {
          if (!isEmpty(currentMenu)) return lv.id;
          currentMenu = (pathname.indexOf(lv.path) > -1) ? lv : {};
        });
      }
      if (!isEmpty(currentMenu)) {
        crumbsList.push({
          id: currentMenu.id, name: currentMenu.name, path: currentMenu.path
        });
      }
      if (currentMenu.path === pathname) {
        this.selectedKeys = [`${currentMenu.id}`];
        this.openKeys = [`${currentMenu.parentId}`];
      } else {
        /* 判断二级 */
        // console.log(currentMenu)
        currentMenu.leafMenuModels.map(lv2 => {

          if (lv2.path === pathname) {
            this.selectedKeys = [`${lv2.id}`];
            this.openKeys = [`${lv2.parentId}`];
            crumbsList.push({
              id: lv2.id, name: lv2.name, path: lv2.path
            });
          } else {
            if (lv2.activeRouter) {
              if (lv2.activeRouter.indexOf(pathname) > -1) {
                this.selectedKeys = [`${lv2.id}`];
                this.openKeys = [`${lv2.parentId}`];
              }
            } else {
              /* 判断三级 */
              if (!isEmpty(lv2.leafMenuModels)) {
                lv2.leafMenuModels.map(lv3 => {
                  if (lv3.path === pathname) {
                    this.selectedKeys = [`${lv3.id}`];
                    this.openKeys = [`${lv2.parentId}`];
                  }
                })
              }
            }
          }
        })
      }
      let history = sessionStorage.getItem('menu') || [];
      if (!isEmpty(history)) {
        history = JSON.parse(history);
        history = uniqBy(history, 'id');
      }
      sessionStorage.setItem('menu', JSON.stringify(history));
      this.crumbsList = crumbsList;
    } catch (error) {
      console.log(error);
    }
  }
  @action toggleMenu({ actionItem, actionId }, finished) {
    try {
      let menuObj = toJS(this.menuObj); // 根菜单节点
      // actionId = actionId;
      /* 查询当前菜单item */
      let current = checkCurrentMenu({ menuObj, actionId });
      let currentMenu = current.currentMenu, crumbsList = current.crumbsList;
      finished(currentMenu[0].path);
      this.crumbsList = crumbsList;
      /* 记录历史-浏览记录 */
      this.setLastMenuHistory(currentMenu[0], actionId);
      this.toggledActionId = currentMenu[0].id;
      this.selectedKeys = [`${currentMenu[0].id}`];
      this.openKeys = [`${currentMenu[0].parentId}`];
    } catch (error) {
      console.log(error)
    }
  }
  setLastMenuHistory = (actionItem, actionId) => {
    let history = sessionStorage.getItem('menu') || [];
    let index = -1;
    if (!isEmpty(history)) history = JSON.parse(history);
    for (let i = 0; i < history.length; i++) {
      if (history[i].id === actionId) {
        index = i;
      }
    }
    if (index > -1) {
      history.splice(index, 1);
    }
    history.push(actionItem);
    if (history.length >= 4) {
      history.splice(0, 1);
    }
    history = uniqBy(history, 'id');
    sessionStorage.setItem('menu', JSON.stringify(history));
  }

  //获取首页工单数据
  @action.bound async getOddCount(params) {
    this.isLoading = true
    try {
      let res = await services.gets('getList')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        this.addInfo = res.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }
  //获取7天已结
  @action.bound async workEndInfo(params) {
    this.isLoading = true
    try {
      let res = await services.gets('workEndInfo')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        let data = res.data.data;
        data.map(item => {
          item.currentDate = item.currentDate.split(' ')[0]
          item.number = Number(item.number)
        })
        this.workInfo = data
      }
    } catch (error) {
      console.log(error)
    }
  }
  //获取设备分布
  @action.bound async deviceInfo(params) {
    this.isLoading = true
    try {
      let res = await services.gets('deviceInfo')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        this.devInfo = res.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }
  //获取维修信息
  @action.bound async getStaffInfo(params) {
    this.isLoading = true
    try {
      let res = await services.gets('staffInfo')(params)
      this.isLoading = false
      if (isDataExist(res)) {
        this.staffInfo = res.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }
  @action.bound addCrumbs(obj) {
    this.crumbsList.push(obj);
  }

  @action changeValue(key, value) {
    this[key] = value;
  }
}
let HomeStore = new Home();
export default HomeStore;