import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import wholeUrl from '../../assets/index_logo.png';
// import partUrl from '../../assets/min_logo.png';
import classnames from 'classnames';
import './index.less';
import { Menu, Layout, Icon, } from 'antd';
import { toJS } from 'mobx';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

let firstMount = false;
@withRouter
@inject('HomeStore')
@observer
class MenuLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      sizetype: '',
      pathname: '',
      isPath: false,
    }
    this.store = this.props.HomeStore;
  }
  render() {
    const isMobile = this.props.mobile === 'true';
    const { menuObj } = toJS(this.store);
    return <Sider
      trigger={null}
      collapsible
      collapsed={
        this.props.sizetype === 's_size' ? false : this.state.collapsed
      }
      className={
        classnames({
          'ant-sider-menu-content': true,
          'ant-sider-menu-none': isMobile
        })
      }
      style={{
        overflowY: 'auto',
        height: this.props.sizetype === 's_size' && '100%'
      }}
    >
      <div id='manu_container'>
        <div className='menu_logo'></div>
        {/* <div className='menu_logo' onClick={this.goBack}>
          {this.props.sizetype !== 's_size' && this.state.collapsed ? <img
            style={{
              paddingLeft: '7px'
            }}
            alt='logo' src={partUrl} width='55%' height='50%' />
            : <img alt='logo' src={wholeUrl} width='60%' height='55%' />}
        </div> */}
        <Menu theme="dark"
          // defaultOpenKeys={toJS(this.store.openKeys)}
          selectedKeys={toJS(this.store.selectedKeys)}
          mode={'inline'}
          onClick={this.handleMenu}
          onOpenChange={this.onOpenChange}
          onSelect={this.onMenuSelect}
        // inlineCollapsed={this.state.collapsed}
        >
          {
            menuObj.map(leaf => !leaf.displayNone && <SubMenu
              key={leaf.id}
              title={<span>{
                leaf.icon ? <Icon type={leaf.icon} /> : leaf.iconfont && <i>
                  <span
                    style={{ marginRight: '10px', verticalAlign: 'middle' }}
                    className={`iconfont ${leaf.iconfont}`}></span>
                </i>
              }<span style={{ display: this.state.collapsed && 'none' }}>{leaf.name}</span></span>}
            >
              {
                leaf.leafMenuModels.length > 0 && leaf.leafMenuModels.map(ele =>
                  !ele.displayNone && <Menu.Item key={ele.id}>{ele.name}</Menu.Item>)
              }
            </SubMenu>)
          }
        </Menu>
      </div>

    </Sider>;
  }
  onMenuSelect = ({ selectedKeys }) => {
    this.store.selectedKeys = selectedKeys;
  }
  onOpenChange = (openKeys) => {
    this.store.openKeys = openKeys;
  }
  handleMenu = ({ item, key, }) => {
    this.props.HomeStore.toggleMenu({ actionItem: item, actionId: key, from: 'menu-click' }, (url) => {
      if (url) {
        this.props.history.push(url);
      } else {
        alert('false');
      }
    });
  }
  goBack = () => {
    this.props.history.push('/index');
  }
  componentDidMount() {
    firstMount = false;
    /* 初始化判断是否显示 */
    if (this.props.sizetype !== 'l_size') {
      this.state.collapsed = true;
    } else {
      this.state.collapsed = false;
    }
    this.setState({});
  }

  static getDerivedStateFromProps(props, state) {
    let newState = { ...state };
    if (props.sizetype === 'l_size') {
      if (props.HomeStore.isClickCollapsed) {
        if (props.sizetype !== state.sizetype) {
          props.HomeStore.changeValue('collapsed', false)
        }
        Object.assign(newState, {
          sizetype: props.sizetype,
          collapsed: props.HomeStore.collapsed,
          pathname: props.location.pathname
        })
      } else {
        Object.assign(newState, {
          sizetype: props.sizetype,
          collapsed: false,
          pathname: props.location.pathname
        })
      }
    } else {
      if (props.HomeStore.isClickCollapsed) {
        if (props.sizetype !== state.sizetype) {
          props.HomeStore.changeValue('collapsed', true)
        }
        Object.assign(newState, {
          sizetype: props.sizetype,
          collapsed: props.HomeStore.collapsed,
          pathname: props.location.pathname
        })
      } else {
        Object.assign(newState, {
          sizetype: props.sizetype,
          collapsed: true,
          pathname: props.location.pathname
        })
      }
    }
    if (props.location.pathname !== state.pathname) {
      Object.assign(newState, {
        isPath: true
      })
    } else {
      Object.assign(newState, {
        isPath: false
      })
    }
    return newState;
  }
  componentDidUpdate() {
    if (this.state.isPath) {
      this.props.HomeStore.initMenu(this.state.pathname)
    }
  }
}
export default MenuLayout;