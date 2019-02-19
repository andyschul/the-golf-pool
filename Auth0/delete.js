function remove(id, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const assert = require('assert');

  MongoClient.connect(configuration.url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(configuration.dbName);

    const users = db.collection('users');

    users.remove({ _id: id }, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  });
}
