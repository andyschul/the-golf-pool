const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis')
const cors = require('cors');
const path = require('path');
const {promisify} = require('util');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const app = express();
const port = process.env.PORT || 5000;
const User = require('./models/user');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const schedule = require('node-schedule');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const http = require('http').Server(app);
const jwtt = require('jsonwebtoken');
const io = require('socket.io')(http);
const privateNamespace = io.of('/private');

io.on('connection', async function(socket){
  let schedule = await socketSchedule();
  socket.emit('tournament_schedule', schedule);
  let yearlyLeaderboard = await socketYearlyLeaderboard();
  socket.emit('yearly_leaderboard', yearlyLeaderboard);
});

privateNamespace.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    let client = jwksRsa({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    });
    function getKey(header, callback){
      client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    jwtt.verify(socket.handshake.query.token, getKey, process.env.AUTH0_CLIENT_SECRET, function(err, decoded) {
      if(err) return next(new Error('Authentication error'));
      socket._id = decoded.sub.split('|')[1];
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})
.on('connection', function(socket) {
    socket.on('profile', async function() {
      let profile = await socketProfile(socket._id);
      socket.emit('profile', profile)
    });
    socket.on('update profile', async function(data, fn) {
      try {
        let profile = await socketUpdateProfile(socket._id, data);
        socket.emit('profile', profile);
        fn(true);
      } catch {
        fn(false);
      };
    });
    socket.on('leaderboard', async function(tournamentId) {
      let leaderboard = await socketLeaderboard(tournamentId, socket._id);
      socket.emit('leaderboard', leaderboard)
    });
    socket.on('picks', async function(tournamentId) {
      let picks = await socketPicks(tournamentId, socket._id);
      socket.emit('picks', picks)
    });
    socket.on('update picks', async function(tournamentId, data, fn) {
      try {
        let update = await socketUpdatePicks(tournamentId, socket._id, data);
        let picks = await socketPicks(tournamentId, socket._id);
        socket.emit('picks', picks)
        fn(true);
      } catch {
        fn(false);
      };
    });
})

async function socketSchedule() {
  let schedule = await getAsync(`schedule:${(new Date()).getFullYear()}`);
  schedule = JSON.parse(schedule)
  let currentTournament = schedule.tournaments.filter(t => {
    let d = new Date(t.end_date);
    d.setDate(d.getDate() + 7);
    return d > new Date();
  }).shift()
  return {currentTournament: currentTournament || {}, tournaments: schedule['tournaments']};
}

async function socketUpdatePicks(tournamentId, userId, picks) {
  const user = await User.findOne({ _id: userId });
  let cachedTournament = await getAsync(`tournaments:${tournamentId}`);
  cachedTournament = JSON.parse(cachedTournament);

  let tournament = user.tournaments.filter(t => t.tournament_id === tournamentId).pop();
  if (tournament) {
    tournament.picks = picks
  } else {
    user.tournaments.push({
      tournament_id: tournamentId,
      name: cachedTournament.name,
      start_date: cachedTournament.start_date,
      picks: picks
    })
  }

  user.save()

  let groups = await getAsync(`tournaments:${tournamentId}:groups`);
  groups = JSON.parse(groups);
  let usertournamentData = user.tournaments.filter(t => t.tournament_id === tournamentId).pop();
  let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
  let retJson = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, saved: true } : { ...player, selected: false })) : [];
  return retJson;
}


async function socketPicks(tournamentId, userId) {
  const user = await User.findOne({ _id: userId });
  let groups = await getAsync(`tournaments:${tournamentId}:groups`);
  if (!groups) {
    return [];
  }
  groups = JSON.parse(groups);
  let usertournamentData = user.tournaments.filter(t => t.tournament_id === tournamentId).pop();
  let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
  let retJson = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, saved: true } : { ...player, selected: false })) : [];
  return retJson;
}

async function socketProfile(userId) {
  const user = await User.findOne({ _id: userId });
  return {
    firstName: user.first_name,
    lastName: user.last_name,
  }
}

async function socketUpdateProfile(userId, data) {
  const user = await User.findOne({ _id: userId });
  user.first_name = data.firstName
  user.last_name = data.lastName
  user.save()

  return {
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

async function socketYearlyLeaderboard() {
  let year = (new Date()).getFullYear();
  let schedule = await getAsync(`schedule:${year}`);
  schedule = JSON.parse(schedule)

  let tournamentPlayerData = {}
  let tournamentIds = [];
  for (let t of schedule.tournaments) {
    let y = new Date(t.start_date).getFullYear();
    if (y === parseInt(year)) {
      players = await getAsync(`tournaments:${t.id}:players`);
      tournamentPlayerData[t.id] = JSON.parse(players);
      tournamentIds.push(t.id)
    }
  }

  let users = await User.find({});
  let leaderboard = [];

  for (let user of users) {
    let userTournaments = user.tournaments.filter(t => tournamentIds.includes(t._doc.tournament_id))
    let tData = [];
    for (let tour of userTournaments) {
      if (!tournamentPlayerData[tour.tournament_id]) {
        continue;
      }
      let picks = tournamentPlayerData[tour.tournament_id] ? tour.picks.map(player => (
        {
          id: tournamentPlayerData[tour.tournament_id][player.id].id,
          first_name: tournamentPlayerData[tour.tournament_id][player.id].first_name,
          last_name: tournamentPlayerData[tour.tournament_id][player.id].last_name,
          position: tournamentPlayerData[tour.tournament_id][player.id].position,
          score: tournamentPlayerData[tour.tournament_id][player.id].score,
          status: tournamentPlayerData[tour.tournament_id][player.id].status || null,
          money: tournamentPlayerData[tour.tournament_id][player.id].money || 0,
          strokes: tournamentPlayerData[tour.tournament_id][player.id].strokes,
        }
      )) : [];

      reducedPicks = picks.reduce((accumulator, item) => {
        accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money;
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
  return leaderboard;
}



async function socketLeaderboard(tournamentId, userId) {
  let leaderboard = await getAsync(`tournaments:${tournamentId}:leaderboard`);
  if (!leaderboard) {
    return {
      tournamentStatus: 'scheduled',
      leaderboard: []
    }
  }
  leaderboard = JSON.parse(leaderboard);

  const users = await User.find({'tournaments.tournament_id': tournamentId});

  const user = await User.findOne({ _id: userId });
  let usertournamentData = user.tournaments.filter(t => t.tournament_id === tournamentId).pop();
  let userPlayerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];

  let players = await getAsync(`tournaments:${tournamentId}:players`);
  players = JSON.parse(players);
  let leaderboardData = []

  leaderboardData = users.map(user => {
    let tournament = user._doc.tournaments.filter(t => t.tournament_id === tournamentId).pop();
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
    obj[item.id] = {...item, selected: userPlayerIds.includes(item.id), picks: []};
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
  return retJson = {
    tournamentStatus: leaderboard.status,
    leaderboard: leaderboardData,
    tournamentLeaderboard: tournamentLeaderboard
  }
}

// privateNamespace.emit('leaderboard', 'everyone!');``
// privateNamespace.on('leaderboard', function(socket) {
//   console.log('server leaderdddboard')
//   socket.emit('leaderboard', 'leaderboard')
// });

// io.sockets
//   .on('connection', socketioJwt.authorize({
//     secret: process.env.AUTH0_CLIENT_SECRET,
//     timeout: 15000 // 15 seconds to send the authentication message
//   })).on('authenticated', function(socket) {
//     //this socket is authenticated, we are good to handle more events from it.
//     console.log('hello! ' + socket.decoded_token.name);
//   });



// io.use(socketioJwt.authorize({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   handshake: true
// }));
//
// io.on('connection', function (socket) {
//   // in socket.io 1.0
//   console.log('hello! ', socket.decoded_token.name);
// })

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
        let userTournaments = user.tournaments.filter(t => tournamentIds.includes(t._doc.tournament_id))
        let tData = [];
        for (let tour of userTournaments) {
          if (!tournamentPlayerData[tour.tournament_id]) {
            continue;
          }
          let picks = tournamentPlayerData[tour.tournament_id] ? tour.picks.map(player => (
            {
              id: tournamentPlayerData[tour.tournament_id][player.id].id,
              first_name: tournamentPlayerData[tour.tournament_id][player.id].first_name,
              last_name: tournamentPlayerData[tour.tournament_id][player.id].last_name,
              position: tournamentPlayerData[tour.tournament_id][player.id].position,
              score: tournamentPlayerData[tour.tournament_id][player.id].score,
              status: tournamentPlayerData[tour.tournament_id][player.id].status || null,
              money: tournamentPlayerData[tour.tournament_id][player.id].money || 0,
              strokes: tournamentPlayerData[tour.tournament_id][player.id].strokes,
            }
          )) : [];

          reducedPicks = picks.reduce((accumulator, item) => {
            accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money;
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
    if (req.query['full']) {
      let groups = await getAsync(`tournaments:${req.params.tournamentId}:groups`);
      if (!groups) {
        res.json([]);
        return next();
      }
      groups = JSON.parse(groups);
      let usertournamentData = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop();
      let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
      let retJson = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, saved: true } : { ...player, selected: false })) : [];
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

    let tournament = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop();
    if (tournament) {
      tournament.picks = req.body.picks
    } else {
      user.tournaments.push({
        tournament_id: req.params.tournamentId,
        name: cachedTournament.name,
        start_date: cachedTournament.start_date,
        picks: req.body.picks
      })
    }

    user.save()

    let groups = await getAsync(`tournaments:${req.params.tournamentId}:groups`);
    groups = JSON.parse(groups);
    let usertournamentData = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop();
    let playerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];
    let retJson = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, saved: true } : { ...player, selected: false })) : [];
    res.json(retJson);
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

    const user = await User.findOne({ _id: req.user.sub.split('|')[1] });
    let usertournamentData = user.tournaments.filter(t => t.tournament_id === req.params.tournamentId).pop();
    let userPlayerIds = usertournamentData ? usertournamentData['picks'].map(x => x.id) : [];

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
      obj[item.id] = {...item, selected: userPlayerIds.includes(item.id), picks: []};
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
http.listen(port, () => console.log(`Listening on port ${port}`));
