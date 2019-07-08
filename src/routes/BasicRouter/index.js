/**
 * 最外层包裹的home组件，包括
 */
import React, { PureComponent } from 'react';
import BasicLayout from 'Layouts/BasicManage';
import {
  Route, Redirect,
} from 'react-router-dom';
import {
  Page01,Page02
} from './configs'

class BasicRouter extends PureComponent {
  render() {
    return <BasicLayout children={<React.Fragment>
        <Route exact path="/basic" render={() => <Redirect to='/basic/01' />} />
        <Route path='/basic/01' component={Page01} />
        <Route path='/basic/02' component={Page02} />
    </React.Fragment>} />;
  }

}
export default BasicRouter;