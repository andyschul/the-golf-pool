function login(email, password, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');
  const bcrypt = require('bcrypt');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');

    users.findOne({$or: [ { email: email }, { username: email } ]}, function (err, user) {
      if (err) return callback(err);
      if (!user) return callback(new WrongUsernameOrPasswordError(email));

      bcrypt.compare(password, user.password, function (err, isValid) {
        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(email));

        return callback(null, {
            user_id: user._id.toString(),
            nickname: user.nickname,
            email: user.email
          });
      });
    });
  });
}
