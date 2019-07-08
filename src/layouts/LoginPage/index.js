import React from 'react';
import { Form, Input, Icon, Checkbox, Button, } from 'antd';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { setCookie, getCookie, clearCookie } from 'utils/dataTools';
import './index.less';

@withRouter
@inject('HomeStore')
@observer
class LoginPage extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return <div className='login_container'>
      <div className='login-big-title'>
        登录页面
      </div>
      <div className='login_form'>
        <div className='basic_login'>
          <div>
            <span style={{ borderBottom: '1px solid #6236FF', paddingBottom: 5, fontSize: 20 }}>用户登录</span>
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入您的用户名！' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入您的密码!' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('unique', {
                rules: [{ required: true, message: '请输入您的公司标识!' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="paper-clip" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="公司标识"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>记住密码</Checkbox>)}
              <div className='login-btn'>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
              </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

    </div>;
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.remember) {
          for (let name in values) {
            setCookie(name, values[name]);
          }
        } else {
          for (let name in values) {
            clearCookie(name);
          }
        }
        // 请求登陆接口
        if (success) {
          sessionStorage.setItem('selfToken', token); // 设置前局登陆token
          sessionStorage.setItem('username', values.username); // 设置登录用户名
          this.props.history.push({
            pathname: '/index',
            state: { username: values.username, password: values.password, selfToken: token }
          });
        } 
      }
    });
  };
  componentDidMount() {
    this.props.form.setFieldsValue({ 'username': getCookie('username') || '' });
    this.props.form.setFieldsValue({ 'password': getCookie('password') || '' });
    this.props.form.setFieldsValue({ 'unique': getCookie('unique') || '' });
    this.props.form.setFieldsValue({ 'remember': getCookie('remember') || '' });
  }

}
const WrappedLoginForm = Form.create({ name: 'login' })(LoginPage);
export default WrappedLoginForm;