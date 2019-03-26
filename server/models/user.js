const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    tournaments: [{ tournament_id: String, name: String, picks: [{ id: String, first_name: String, last_name: String, country: String, }] }]
});

module.exports = mongoose.model('User', UserSchema);
