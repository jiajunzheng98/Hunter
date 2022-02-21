import React, { Component } from 'react';
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { register } from '../../redux/actions';
import Logo from '../../components/logo/logo';

const ListItem = List.Item;

class Register extends Component {
  state = {
    username: '',
    password: '',
    confirmed: '',
    type: 'employer'
  }

  handleChange = (name, val) => {
    this.setState({ [name]: val });
  }

  register = () => {
    this.props.register(this.state);
  }

  toLogin = () => {
    this.props.history.replace('/login');
  }

  render() {
    const { type } = this.state;
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
            <InputItem placeholder="Enter your password again" type="password" onChange={val => {this.handleChange('confirmed', val)}}>Confirmed:</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>User Type:</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={type === 'candidate'} onChange={() => {this.handleChange('type', 'candidate')}}>&nbsp;Candidate</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={type === 'employer'} onChange={() => {this.handleChange('type', 'employer')}}>&nbsp;Employer</Radio>
            </ListItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>Register</Button>
            <WhiteSpace/>
            <Button onClick={this.toLogin}>Already have an account</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect( state => ({user: state.user}), { register } )(Register);