function verify(email, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');
    const query = { email: email, email_verified: false };

    users.update(query, { $set: { email_verified: true } }, function (err, count) {
      if (err) return callback(err);
      callback(null, count > 0);
    });
  });
}
