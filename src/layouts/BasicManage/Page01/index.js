import React from 'react';
import { inject,observer } from 'mobx-react';
import { Button } from 'antd';

@inject('BasicStore')
@observer
class Page extends React.Component{
  constructor(props){
    super(props)
    this.store = this.props.BasicStore;
  }
  render(){
    return <div>
      展示页面01
      <Button onClick={this.toPage02}>前往展示页面02</Button>
    </div>
  }
  toPage02 = ()=>{
    this.props.history.push('/basic/02');
  }
}
export default Page;