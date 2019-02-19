function getByEmail(email, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');
  const bcrypt = require('bcrypt');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');

    users.findOne({ email: email }, function (err, user) {
      if (err || !user) return callback(err || null);

      return callback(null, {
        user_id: user._id.toString(),
        nickname: user.nickname,
        email: user.email
      });
    });
  });
}
