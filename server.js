const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis')
const cors = require('cors');
const path = require('path');
const {promisify} = require('util');
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
require('./scheduler');

const app = express();
const port = process.env.PORT || 5000;
const User = require('./models/user');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const majors = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  client.set("foo", "bar");
  getAsync('foo').then(function(res) {
      console.log(res); // => 'bar'
  });
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.get('/api/schedule/:year', async (req, res, next) => {
  try {
    let schedule = await getAsync(`schedule:${req.param('year')}`);
    schedule = JSON.parse(schedule)
    console.log(schedule)
    res.json(schedule['tournaments']);
  } catch (e) {
    next(e)
  }
});

app.get('/api/groupings', async (req, res, next) => {
  try {
    let groups = await getAsync(`tournaments:b404a8d5-5e33-4417-ae20-5d4d147042ee:groups`);
    groups = JSON.parse(groups)
    res.json(groups['groups']);
  } catch (e) {
    next(e)
  }
});

app.get('/api/tournaments/:tournyId/groups', async (req, res, next) => {
  try {
    let groups = await getAsync(`tournaments:${req.param('tournyId')}:groups`);
    groups = JSON.parse(groups)
    res.json(groups['groups']);
  } catch (e) {
    next(e)
  }
});

app.get('/api/users/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.param('userId') });
    res.json({msg: 'ok'});
  } catch (e) {
    next(e)
  }
});

app.put('/api/users/:userId/tournaments/:tournyId/picks', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.param('userId') });
    user.tournaments = [{tournament_id: req.param('tournyId'), picks: req.body['picks']}]
    user.save()
    res.json({tournaments: user.tournaments});
  } catch (e) {
    next(e)
  }
});

app.get('/api/users/:userId/tournaments/:tournyId/picks', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.param('userId') });
    let userTournyData = user.tournaments.filter(t => t.tournament_id === req.param('tournyId'))[0];
    if (req.query['full']) {
      let groups = await getAsync(`tournaments:${req.param('tournyId')}:groups`);
      groups = JSON.parse(groups);
      let playerIds = userTournyData ? userTournyData['picks'].map(x => x.id) : [];
      let retJson = groups ? groups['groups'].map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, selected: true } : { ...player, selected: false })) : [];
      res.json(retJson);
    } else {
      res.json(userTournyData);
    }
  } catch (e) {
    next(e)
  }
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));
