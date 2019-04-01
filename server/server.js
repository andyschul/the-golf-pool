const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis')
const cors = require('cors');
const path = require('path');
const {promisify} = require('util');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});


app.get('/api/schedule/:year', async (req, res, next) => {
  try {
    let schedule = await getAsync(`schedule:${req.params.year}`);
    schedule = JSON.parse(schedule)
    let currentTournament = schedule.tournaments.filter(t => {
      let d = new Date(t.end_date);
      d.setDate(d.getDate() + 7);
      return d > new Date();
    }).shift()
    res.json({currentTournament: currentTournament || {}, tournaments: schedule['tournaments']});
  } catch (e) {
    next(e)
  }
});

app.get('/api/profile', checkJwt, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.sub.split('|')[1] });
    res.json({
      firstName: user.first_name,
      lastName: user.last_name,
    })
  } catch (e) {
    next(e)
  }
});

app.put('/api/profile', checkJwt, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.sub.split('|')[1] });
    user.first_name = req.body.firstName
    user.last_name = req.body.lastName
    user.save()

    res.json({
      firstName: user.first_name,
      lastName: user.last_name,
    })
  } catch (e) {
    next(e)
  }
});

app.get('/api/schedule/:year/leaderboard', async (req, res, next) => {
  try {
    let schedule = await getAsync(`schedule:${req.params.year}`);
    schedule = JSON.parse(schedule)

    let tournamentPlayerData = {}
    let tournamentIds = [];
    for (let t of schedule.tournaments) {
      let y = new Date(t.start_date).getFullYear();
      if (y === parseInt(req.params.year)) {
        players = await getAsync(`tournaments:${t.id}:players`);
        tournamentPlayerData[t.id] = JSON.parse(players);
        tournamentIds.push(t.id)
      }
    }

    User.find({}, function(err, users) {
      let leaderboard = [];

      for (let user of users) {
        userTournaments = user.tournaments.filter(t => tournamentIds.includes(t.tournament_id))

        let tData = []
        for (let tour of userTournaments) {
          let picks = tour.picks.map(player => (
            {
              id: tournamentPlayerData[tour.tournament_id][player.id].id,
              first_name: tournamentPlayerData[tour.tournament_id][player.id].first_name,
              last_name: tournamentPlayerData[tour.tournament_id][player.id].last_name,
              position: tournamentPlayerData[tour.tournament_id][player.id].position,
              score: tournamentPlayerData[tour.tournament_id][player.id].score,
              status: tournamentPlayerData[tour.tournament_id][player.id].status || null,
              money: tournamentPlayerData[tour.tournament_id][player.id].money || null,
              strokes: tournamentPlayerData[tour.tournament_id][player.id].strokes,
            }
          ));

          reducedPicks = picks.reduce((accumulator, item) => {
            accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money || 0;
            accumulator.totalMadeCuts = (accumulator.totalMadeCuts || 0) + (item.status === 'CUT' ? 0 : 1);
            accumulator.totalScore = (accumulator.totalScore || 0) + item.score;
            accumulator.totalPosition = (accumulator.totalPosition || 0) + item.position;
            return accumulator;
          }, {});
          reducedPicks['avgPosition'] = reducedPicks['totalPosition'] / picks.length;
          tData.push({
            name: tour.name,
            id: tour.tournament_id,
            ...reducedPicks
          })
        }
        yData = tData.reduce((accumulator, item) => {
          accumulator.yearlyTotalMoney = (accumulator.yearlyTotalMoney || 0) + item.totalMoney || 0;
          accumulator.yearlyTotalMadeCuts = (accumulator.yearlyTotalMadeCuts || 0) + item.totalMadeCuts || 0;
          accumulator.yearlyTotalScore = (accumulator.yearlyTotalScore || 0) + item.totalScore;
          accumulator.yearlyTotalPosition = (accumulator.yearlyTotalPosition || 0) + item.totalPosition;
          return accumulator;
        }, {});

        leaderboard.push({
          id: user.id,
          username: user._doc.username,
          first_name: user._doc.first_name,
          last_name: user._doc.last_name,
          tournaments: tData,
          ...yData,
        })
      }
      leaderboard.sort((a,b) => (a.yearlyTotalMoney > b.yearlyTotalMoney) ? -1 : ((b.yearlyTotalMoney > a.yearlyTotalMoney) ? 1 : 0))
      res.send(leaderboard);
    });
  } catch (e) {
    next(e)
  }
});

app.get('/api/tournaments/:tournamentId/groups', checkJwt, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.sub.split('|')[1] });
    let usertournamentData = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId)[0];
    if (req.query['full']) {
      let groups = await getAsync(`tournaments:${req.params.tournamentId}:groups`);
      groups = JSON.parse(groups);
      let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
      let retJson = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, selected: true } : { ...player, selected: false })) : [];
      res.json(retJson);
    } else {
      res.json(usertournamentData);
    }
  } catch (e) {
    next(e)
  }
});

app.put('/api/tournaments/:tournamentId/picks', checkJwt, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.sub.split('|')[1] });

    let cachedTournament = await getAsync(`tournaments:${req.params.tournamentId}`);
    cachedTournament = JSON.parse(cachedTournament);

    let userTournament = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop()
    if (userTournament) {
      userTournament.picks = req.body.picks
    } else {
      user.tournaments.push({
        tournament_id: req.params.tournamentId,
        name: cachedTournament.name,
        start_date: cachedTournament.start_date,
        picks: req.body.picks
      })
    }

    user.save()
    res.json({tournaments: user.tournaments});
  } catch (e) {
    next(e)
  }
});

app.get('/api/tournaments/:tournamentId/leaderboard', checkJwt, async (req, res, next) => {
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

    const users = await User.find({'tournaments.tournament_id': req.params.tournamentId});
    let players = await getAsync(`tournaments:${req.params.tournamentId}:players`);
    players = JSON.parse(players);
    let leaderboardData = []

    leaderboardData = users.map(user => {
      let tournament = user._doc.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop();
      picks = tournament.picks.map(player => (
        {
          id: players[player.id].id,
          first_name: players[player.id].first_name,
          last_name: players[player.id].last_name,
          position: players[player.id].position,
          score: players[player.id].score,
          status: players[player.id].status || null,
          money: players[player.id].money || null,
          strokes: players[player.id].strokes,
        }
      ));

      picks.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));

      reducedPicks = picks.reduce((accumulator, item) => {
        accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money || 0;
        accumulator.totalMadeCuts = (accumulator.totalMadeCuts || 0) + (item.status === 'CUT' ? 0 : 1);
        accumulator.totalScore = (accumulator.totalScore || 0) + item.score;
        accumulator.totalPosition = (accumulator.totalPosition || 0) + item.position;
        return accumulator;
      }, {});
      reducedPicks.avgPosition = reducedPicks.totalPosition / picks.length;

      return {
        id: user.id,
        username: user._doc.username,
        first_name: user._doc.first_name,
        last_name: user._doc.last_name,
        picks: picks,
        ...reducedPicks
      }
    })

    leaderboard.status === 'closed' ?
      leaderboardData.sort((a,b) => (a.totalMoney > b.totalMoney) ? -1 : ((b.totalMoney > a.totalMoney) ? 1 : 0))
      :
      leaderboardData.sort((a,b) => (a.totalScore > b.totalScore) ? 1 : ((b.totalScore > a.totalScore) ? -1 : 0));

    let l = leaderboard.leaderboard.reduce((obj, item) => {
      obj[item.id] = {...item, picks: []};
      return obj;
    }, {})
    let pos = 1;
    for (let p of leaderboardData) {
      for (let pick of p.picks) {
        l[pick.id].picks.push({position: pos, ...p})
      }
      pos++;
    }

    let tournamentLeaderboard = leaderboard.leaderboard.map(pl => l[pl.id])
    retJson = {
      tournamentStatus: leaderboard.status,
      leaderboard: leaderboardData,
      tournamentLeaderboard: tournamentLeaderboard
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
