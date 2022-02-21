import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserList } from '../../redux/actions';

import UserList from '../../components/user-list/user-list';

class Candidate extends Component {
  componentDidMount () {
    this.props.getUserList('employer');
  }

  render() {
    return (
      <UserList userList={this.props.userList}/>
    )
  }
}

export default connect(
  state => ({userList: state.userList}),
  {getUserList}
)(Candidate);