function create(user, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');
  const bcrypt = require('bcrypt');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');

    users.findOne({$or: [ { email: user.email }, { username: user.username } ]}, function (err, withSameMail) {
      if (err) return callback(err);
      if (withSameMail) return callback(new Error('the user already exists'));

      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return callback(err);
        user.password = hash;
        users.insert(user, function (err, inserted) {
          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}
