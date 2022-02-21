import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { NavBar } from 'antd-mobile';
import { getRedirectTo } from '../../utils';
import { getUser } from '../../redux/actions';
import EmployerInfo from '../employer-info/employer-info';
import CandidateInfo from '../candidate-info/candidate-info';
import Employer from '../employer/employer';
import Candidate from '../candidate/candidate';
import Message from '../message/message';
import Personal from '../personal/personal';
import Chat from '../chat/chat';
import NotFound from '../../components/not-found/not-found';
import BottomTab from '../../components/bottom-tab/bottom-tab';


class Main extends Component {
  navList = [
    {
      path: '/employer',
      component: 'Employer',
      title: 'Candidate List',
      icon: 'candidate',
      text: 'Candidate',
    },
    {
      path: '/candidate',
      component: 'Candidate',
      title: 'Employer List',
      icon: 'employer',
      text: 'Employer',
    },
    {
      path: '/message',
      component: 'Message',
      title: 'Message',
      icon: 'message',
      text: 'Message',
    },
    {
      path: '/personal',
      component: 'Personal',
      title: 'User Center',
      icon: 'personal',
      text: 'Personal',
    }
  ]

  componentDidMount () {
    const userid = Cookies.get('userid');
    const { _id } = this.props.user;
    if (userid && !_id) {
      this.props.getUser();
    }
  }

  render() {
    const userid = Cookies.get('userid');
    if (!userid) {
      return <Redirect to='/login' />;
    }
    const { user, unReadCount } = this.props;
    if (!user._id) {
      return null;
    } else {
      const path = this.props.location.pathname;
      if (path === '/') {
        return <Redirect to={getRedirectTo(user.type, user.avatar)} />;
      }
    }

    const { navList } = this;
    const path = this.props.location.pathname;
    const currentNav = navList.find(nav => nav.path === path);

    if (currentNav) {
      if (user.type === 'employer') {
        navList[1].hide = true;
      } else {
        navList[0].hide = true;
      }
    }
    return (
      <div>
        {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
        <Switch>
          <Route path='/employer' component={Employer}/>
          <Route path='/candidate' component={Candidate}/>
          <Route path='/message' component={Message}/>
          <Route path='/personal' component={Personal}/>
          <Route path='/employerinfo' component={EmployerInfo}/>
          <Route path='/candidateinfo' component={CandidateInfo}/>
          <Route path='/chat/:userid' component={Chat} />
          <Route componet={NotFound} />
        </Switch>
        {currentNav ? <BottomTab navList={navList} unReadCount={unReadCount}/> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main);