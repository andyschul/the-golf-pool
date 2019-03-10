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

app.get('/api/schedule/:year', async (req, res, next) => {
  try {
    let schedule = await getAsync(`schedule:${req.params.year}`);
    schedule = JSON.parse(schedule)
    res.json(schedule['tournaments']);
  } catch (e) {
    next(e)
  }
});

app.get('/api/users/:userId/tournaments/:tournamentId/groups', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    let usertournamentData = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId)[0];
    if (req.query['full']) {
      let groups = await getAsync(`tournaments:${req.params.tournamentId}:groups`);
      groups = JSON.parse(groups);
      let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
      let retJson = groups ? groups['groups'].map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, selected: true } : { ...player, selected: false })) : [];
      res.json(retJson);
    } else {
      res.json(usertournamentData);
    }
  } catch (e) {
    next(e)
  }
});

app.put('/api/users/:userId/tournaments/:tournamentId/picks', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    user.tournaments = [{tournament_id: req.params.tournamentId, picks: req.body['picks']}]
    user.save()
    res.json({tournaments: user.tournaments});
  } catch (e) {
    next(e)
  }
});

app.get('/api/tournaments/:tournamentId/leaderboard', async (req, res, next) => {
  try {
    let leaderboard = await getAsync(`tournaments:${req.params.tournamentId}:leaderboard`);
    if (!leaderboard) {
      res.json({
        tournamentStatus: 'scheduled',
        leaderboard: []
      });
      return next()
    }
    leaderboard = JSON.parse(leaderboard);

    let tdate = new Date(`${leaderboard.leaderboard.start_date}T00:00:00`)
    tdate.setDate(tdate.getDate() + 1);
    if (tdate > new Date()) {
      res.json({
        tournamentStatus: 'scheduled',
        leaderboard: []
      });
      return next();
    }

    const users = await User.find({});
    let players = await getAsync(`tournaments:${req.params.tournamentId}:players`);

    players = JSON.parse(players);
    let r = players.players;
    let leaderboardData = []

    leaderboardData = users.map(user => {
      let tournamentPicks = user._doc.tournaments.filter(t => t.tournament_id === req.params.tournamentId)[0].picks;
      picks = tournamentPicks.map(player => (
        {
          id: r[player._doc.id].id,
          first_name: r[player._doc.id].first_name,
          last_name: r[player._doc.id].last_name,
          position: r[player._doc.id].position,
          score: r[player._doc.id].score,
          status: r[player._doc.id].status || null,
          money: r[player._doc.id].money || null,
          strokes: r[player._doc.id].strokes,
        }
      ));

      picks.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));

      reducedPicks = picks.reduce((accumulator, item) => {
        accumulator['totalMoney'] = (accumulator['totalMoney'] || 0) + item['money'] || 0;
        accumulator['totalScore'] = (accumulator['totalScore'] || 0) + item['score'];
        accumulator['totalPosition'] = (accumulator['totalPosition'] || 0) + item['position'];
        return accumulator;
      }, {});
      reducedPicks['avgPosition'] = reducedPicks['totalPosition'] / picks.length;

      return {
        id: user.id,
        username: user._doc.username,
        picks: picks,
        ...reducedPicks
      }
    })

    leaderboard.leaderboard.status === 'closed' ?
      leaderboardData.sort((a,b) => (a.totalMoney > b.totalMoney) ? -1 : ((b.totalMoney > a.totalMoney) ? 1 : 0))
      :
      leaderboardData.sort((a,b) => (a.totalScore > b.totalScore) ? 1 : ((b.totalScore > a.totalScore) ? -1 : 0));

    retJson = {
      tournamentStatus: leaderboard.leaderboard.status,
      leaderboard: leaderboardData
    }
    res.json(retJson);
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
