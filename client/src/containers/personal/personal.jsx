import React from 'react';
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { resetUser } from '../../redux/actions';

const Item = List.Item;
const Brief = Item.Brief;

class Personal extends React.Component {
  logout = () => {
    Modal.alert('Sign Out', 'Are you sure?', [
      {text: 'Cancel'},
      {
        text: 'Confirm',
        onPress: () => {
          Cookies.remove('userid');
          this.props.resetUser();
        }
      }
    ])
  }
  render() {
    const {username, info, avatar, company, position, salary} = this.props.user 
    return (
      <div style={{marginBottom: 50, marginTop: 50}}>
        <Result
          img={
            <img src={require(`../../assets/image/${avatar}.png`)}
              style={{width: 50}}
              alt='avatar'
            />
          }
          title={username}
          message={company}
        />
        <List renderHeader={() => 'About'}> 
          <Item multipleLine>
            <Brief>Position: {position}</Brief>
            <Brief>Information: {info}</Brief>
            {salary ? <Brief>Salary: {salary}</Brief> : null}
          </Item> 
        </List>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logout}>Logout</Button>
        </List>
      </div>
    )
  } 
}

export default connect(
  state => ({user: state.user}),
  {resetUser}
)(Personal);