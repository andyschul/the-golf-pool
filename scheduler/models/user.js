const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String
});

module.exports = mongoose.model('User', UserSchema);
