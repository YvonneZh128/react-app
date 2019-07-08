/**
 * 最外层包裹的home组件，包括
 */
import React, { PureComponent } from 'react';
import HomeLayout from 'Layouts/HomeLayout';
import {
  Route, Redirect,
} from 'react-router-dom';
import {
  HomePage,
  BasicManage,
} from './configs'

class HomeRouter extends PureComponent {
  state = {
    innerHeight: window.innerHeight
  };
  render() {
    const isMobile = navigator.userAgent.toLowerCase().indexOf('mobile') > -1 ? 'mobile' : 'pc';
    return <div className='main'
      style={{
        height: this.state.innerHeight + 'px'
      }}
    >
      <HomeLayout type={isMobile} children={<React.Fragment>
        <Route exact path="/" render={() => <Redirect to='/login' />} />
        <Route path='/index' component={HomePage} />
        <Route path='/basic' component={BasicManage} />

      </React.Fragment>} />
    </div>;
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  handleResize = (e) => {
    this.setState({
      innerHeight: e.target.innerHeight
    });
  }

}
export default HomeRouter;