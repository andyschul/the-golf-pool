function changePassword(email, newPassword, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');
  const bcrypt = require('bcrypt');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) return callback(err);
      users.update({ email: email }, { $set: { password: hash } }, function (err, count) {
        if (err) return callback(err);
        callback(null, count > 0);
      });
    });
  });
}
