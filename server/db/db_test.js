const md5 = require('blueimp-md5');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hunter_test', { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.on('connected', function() {
  console.log('db is connected');
});

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String, required: true}
});

const UserModel = mongoose.model('user', userSchema);

function testSave() {
  const userModel = new UserModel({
    username: 'Tom',
    password: md5('234'),
    type: 'candidate'
  });

  userModel.save(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });
}

// testSave();

function testFind() {
  UserModel.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      console.log(users);
    }
  });

  UserModel.findOne({_id: '6059112b7fbd4f856a6e7529'}, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });
}

testFind();

function testUpdate() {
  UserModel.findByIdAndUpdate(
    { _id: "6059150e4d6cd2869d15c99b" },
    { username: 'Jack' }, function(err, oldUser) {
      console.log(err);
      console.log(oldUser);
    });
};

// testUpdate();

function testDelete() {
  UserModel.remove({ _id: '6059150e4d6cd2869d15c99b'}, function(err, data) {
    console.log(err);
    console.log(data);
  });
}

// testDelete();