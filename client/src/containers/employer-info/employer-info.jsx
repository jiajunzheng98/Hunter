import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile';
import AvatarSelector from '../../components/avatar-selector/avatar-selector';
import { updateUser } from '../../redux/actions';

class EmployerInfo extends Component {
  state = {
    avatar: '',
    position: '',
    info: '',
    company: '',
    salary: ''
  };

  setAvatar = (avatar) => {
    this.setState({avatar});
  }

  handleChange = (name, val) => {
    this.setState({ [name] : val });
  }
  
  render () {
    const { avatar, type } = this.props.user;
    if (avatar) {
      const path = type==='employer' ? '/employer' : '/candidate';
      return <Redirect to={path}/>;
    }
    return (
      <div>
        <NavBar>Employer's Information</NavBar>
        <AvatarSelector setAvatar={this.setAvatar}/>
        <InputItem placeholder='Please enter hiring position' onChange={val => {this.handleChange('position', val)}}>Position:</InputItem>
        <InputItem placeholder='Please enter company name' onChange={val => {this.handleChange('company', val)}}>Company:</InputItem>
        <InputItem placeholder='Please enter the salary' onChange={val => {this.handleChange('salary', val)}}>Salary:</InputItem>
        <TextareaItem title="Skills:" rows={3} onChange={val => {this.handleChange('info', val)}}/>
        <Button type='primary' onClick={() => {this.props.updateUser(this.state)}}>Save</Button>
      </div>
    )
  }
}

export default connect (
  state => ({user : state.user}),
  {updateUser}
)(EmployerInfo);