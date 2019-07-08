/**
 * 首页豆腐块配置 连接到主页面
 */
import React from 'react';
import './index.less';
import { Button, } from 'antd';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';


@withRouter
@inject('HomeStore')
@observer
class HomePage extends React.Component {
  state = {
    isShow: false
  };
  render() {
    return (
      <div className='home_index'>
        首页配置展示区
        <Button onClick={this.handleInSystem}>进入系统</Button>
      </div>
    );
  }
  handleInSystem = () => {
    /* 进入即请求菜单 */
    this.props.history.push('/basic')
    this.props.HomeStore.initMenu(this.props.location.pathname)
  }
  componentDidMount() {
  }
}

export default HomePage;


