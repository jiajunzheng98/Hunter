import io from 'socket.io-client';
import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RECEIVE_USER_LIST, RESET_USER, RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ } from './action-types';
import { reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqChatMsgList, reqReadMsg } from '../api';

const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});

const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});

const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

export const resetUser = (msg) => ({type: RESET_USER, data: msg});

const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});

const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}});

const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: { chatMsg, userid}});

const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

export const register = (user) => {
  const { username, password, confirmed, type } = user; 
  if (!username) {
    return errorMsg('Please enter the username');
  } else if (password !== confirmed) {
    return errorMsg('Confirmed password has to be the same as the password');
  }

  return async dispatch => {
    const response = await reqRegister({username, password, type});
    const result = response.data;
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    } else {
      dispatch(errorMsg(result.msg));
    }
  }
}

export const login = (user) => {
  const { username, password } = user; 
  if (!username) {
    return errorMsg('Please enter the username');
  } else if (!password) {
    return errorMsg('Please enter the password');
  }

  return async dispatch => {
    const response = await reqLogin(user);
    const result = response.data;
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    } else {
      dispatch(errorMsg(result.msg));
    }
  }
}

export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user);
    const result = response.data;
    if (result.code === 0) {
      dispatch(receiveUser(result.data));
    } else {
      dispatch(resetUser(result.msg));
    }
  }
}

export const getUser = () => {
  return async dispatch => {
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id);
      dispatch(receiveUser(result.data));
    } else {
      dispatch(resetUser(result.msg));
    }
  }
}

export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) {
      dispatch(receiveUserList(result.data));
    }
  }
}

function initIO(dispatch, userid) {
  if (!io.socket) {
    io.socket = io('ws://localhost:4000');
    io.socket.on('receiveMsg', function (chatMsg) {
      if (userid === chatMsg.from || userid === chatMsg.to) {
        dispatch(receiveMsg(chatMsg, userid));
      }
    });
  }
}

async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if (result.code === 0) {
    const { users, chatMsgs } = result.data;
    dispatch(receiveMsgList({users, chatMsgs, userid}));
  }
}

export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    io.socket.emit('sendMsg', {from , to, content});
  }
}

export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from);
    const result = response.data;
    if (result.code === 0) {
      const count = result.data;
      dispatch(msgRead({count, from, to}));
    }
  }
}