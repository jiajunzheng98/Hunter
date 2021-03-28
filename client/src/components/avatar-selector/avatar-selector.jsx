import React, { Component } from 'react';
import { List, Grid }from 'antd-mobile';
import PropTypes from 'prop-types';

export default class AvatarSelector extends Component {

  static propTypes = { setAvatar: PropTypes.func.isRequired }

  constructor(props) {
    super(props);
    this.avatarList = [];
    for (let i = 0; i < 20; i++) {
      this.avatarList.push({
        text: 'avatar'+(i+1),
        icon: require(`../../assets/image/avatar${i+1}.png`)
      });
    }
  }

  state = { icon: null }

  handleClick = ({ text, icon }) => {
    this.setState({icon});
    this.props.setAvatar(text);
  }

  render() {
    const { icon } = this.state;
    const listAvatar = icon ? (<div>Selected:<img src={ icon } alt='avatar'/></div>) : 'Please select'

    return (
      <List renderHeader={() => listAvatar}>
        <Grid data={this.avatarList} columnNum={5} onClick={this.handleClick}></Grid>
      </List>
    );
  }
}