import React, { Component } from 'react';
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../redux/actions';
import Logo from '../../components/logo/logo';

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = (name, val) => {
    this.setState({ [name]: val });
  }

  login = () => {
    this.props.login(this.state);
  }

  toRegister = () => {
    this.props.history.replace('/register');
  }

  render() {
    const { msg, redirectTo } = this.props.user;
    if (redirectTo) {
      return <Redirect to={redirectTo}></Redirect>
    }
    return (
      <div>
        <NavBar>H&nbsp;U&nbsp;N&nbsp;T&nbsp;E&nbsp;R</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg?<div className="error-msg">{msg}</div> : null}
            <WhiteSpace/>
            <InputItem placeholder="Enter your username" onChange={val => {this.handleChange('username', val)}}>User Name:</InputItem>
            <WhiteSpace/>
            <InputItem placeholder="Enter your password" type="password" onChange={val => {this.handleChange('password', val)}}>Password:</InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.login}>Log&nbsp;in</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>Don't have an account</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect( state => ({user: state.user}), { login } )(Login);