var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5');
const { UserModel, ChatModel } = require('../db/models');
const filter = { password: 0, __v: 0 };


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
  const { username, password, type } = req.body;
  UserModel.findOne({ username }, function (err, user) {
    if (user) {
      res.send({code: 1, msg: 'User has already registered'});
    } else {
      new UserModel({ username, password: md5(password), type }).save(function (err, user) {
        if (err) {
          console.log(err);
        }
        const data = { _id: user._id, username, type };
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7});
        res.send({code: 0, data});
      });
    }
  });
});

router.post('/login', function (req, res) {
  const { username, password } = req.body;
  UserModel.findOne({ username, password: md5(password) }, filter, function(err, user) {
    if (user) {
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7});
      res.send({code: 0, data: user});
    } else {
      res.send({code: 1, msg: 'username or password is not correct'});
    }
  });
});

router.post('/update', function (req, res) {
  const userid = req.cookies.userid;
  if (!userid) {
    return res.send({code: 1, msg: 'Please login first'});
  }
  const user = req.body;
  UserModel.findByIdAndUpdate({_id: userid}, user, function (err, oldUser) {
    if (!oldUser) {
      res.clearCookie('userid');
      return res.send({code: 1, msg: 'Please login first'});
    } else {
      const { _id, username, type } = oldUser;
      const data = Object.assign(user, {_id, username, type});
      res.send({code: 0, data});
    }
  });

});

router.get('/user', function (req, res) {
  const userid = req.cookies.userid;
  if (!userid) {
    res.send({code: 1, msg: 'Please login first'});
  }
  UserModel.findOne({_id: userid}, filter, function (err, user) {
    if (!user) {
      return res.send({code: 1, msg: 'Please login first'});
    }
    res.send({code: 0, data: user});
  });
});

router.get('/userlist', function (req, res) {
  const {type} = req.query;
  UserModel.find({type}, filter, function (err, users) {
    res.send({code: 0, data: users});
  });
});

router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid;

  UserModel.find(function (err, userDocs) {
    const users = {};
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, avatar: doc.avatar};
    })

    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}});
    })
  })
})

router.post('/readmsg', function (req, res){
  const from = req.body.from;
  const to = req.cookies.userid;

  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    res.send({code: 0, data: doc.nModified});
  })
})
module.exports = router;
