import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile';
import AvatarSelector from '../../components/avatar-selector/avatar-selector';
import { updateUser } from '../../redux/actions';

class CandidateInfo extends Component {
  state = {
    avatar: '',
    position: '',
    info: '',
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
      const path = type === 'candidate' ? '/candidate' : '/employer';
      return <Redirect to={path} />
    }
    return (
      <div>
        <NavBar>Candidate's Information</NavBar>
        <AvatarSelector setAvatar={this.setAvatar}/>
        <InputItem placeholder='Please enter desire position' onChange={(val) => {this.handleChange('position', val)}}>Position:</InputItem>
        <TextareaItem title="Introduction:" rows={3} onChange={(val) => {this.handleChange('info', val)}}/>
        <Button type='primary' onClick={() => {this.props.updateUser(this.state)}}>Save</Button>
      </div>
    )
  }
}

export default connect (
  state => ({user: state.user}),
  {updateUser}
)(CandidateInfo);