const server = require('http').createServer();
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const port = process.env.PORT || 5000;
const redis = require('redis')
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const io = require('socket.io')(server);
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

    jwt.verify(socket.handshake.query.token, getKey, process.env.AUTH0_CLIENT_SECRET, function(err, decoded) {
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
        if (update) {
          let picks = await socketPicks(tournamentId, socket._id);
          socket.emit('picks', picks)
        }
        fn(update);
      } catch {
        fn({});
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
  let groups = await getAsync(`tournaments:${tournamentId}:groups`);
  groups = JSON.parse(groups);
  const user = await User.findOne({ _id: userId });
  if (new Date(groups[0][0].tee_time) > new Date()) {
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
    await user.save()
    return true;
  }
  return false;
}


async function socketPicks(tournamentId, userId) {
  const user = await User.findOne({ _id: userId });
  let groups = await getAsync(`tournaments:${tournamentId}:groups`);
  if (!groups) {
    return {
      picks: [],
      locked: true
    };
  }
  groups = JSON.parse(groups);
  let usertournamentData = user.tournaments.filter(t => t.tournament_id === tournamentId).pop();
  let playerIds = usertournamentData ? usertournamentData.picks.map(x => x.id) : [];
  let picks = groups.length ? groups.map((group) => group.map(player => playerIds.includes(player.id) ? { ...player, saved: true } : { ...player, selected: false })) : [];
  let locked = new Date(groups[0][0].tee_time) < new Date();
  return {
    picks: picks,
    locked: locked
  };
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
      let picks = tournamentPlayerData[tour.tournament_id] ? tour.picks.map(player => {
        if (!tournamentPlayerData[tour.tournament_id][player.id]) {
          return null;
        }
        return {
          id: tournamentPlayerData[tour.tournament_id][player.id].id,
          first_name: tournamentPlayerData[tour.tournament_id][player.id].first_name,
          last_name: tournamentPlayerData[tour.tournament_id][player.id].last_name,
          position: tournamentPlayerData[tour.tournament_id][player.id].position,
          score: tournamentPlayerData[tour.tournament_id][player.id].score,
          status: tournamentPlayerData[tour.tournament_id][player.id].status || null,
          money: tournamentPlayerData[tour.tournament_id][player.id].money || 0,
          strokes: tournamentPlayerData[tour.tournament_id][player.id].strokes,
        }
      }) : [];
      let filteredPicks = picks.filter((pick) => (pick != null));
      let reducedPicks = filteredPicks.reduce((accumulator, item) => {
        accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money;
        accumulator.totalMadeCuts = (accumulator.totalMadeCuts || 0) + (item.status === 'CUT' ? 0 : 1);
        accumulator.totalScore = (accumulator.totalScore || 0) + item.score;
        accumulator.totalPosition = (accumulator.totalPosition || 0) + item.position;
        return accumulator;
      }, {});
      reducedPicks['avgPosition'] = reducedPicks['totalPosition'] / filteredPicks.length;
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
    picks = tournament.picks.map(player => {
      if (!players[player.id]) {
        return null;
      }
      return {
        id: players[player.id].id,
        first_name: players[player.id].first_name,
        last_name: players[player.id].last_name,
        position: players[player.id].position,
        score: players[player.id].score,
        status: players[player.id].status || null,
        money: players[player.id].money || null,
        strokes: players[player.id].strokes,
      }
    });
    let filteredPicks = picks.filter((pick) => (pick != null));

    filteredPicks.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));

    reducedPicks = filteredPicks.reduce((accumulator, item) => {
      accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money || 0;
      accumulator.totalMadeCuts = (accumulator.totalMadeCuts || 0) + (item.status === 'CUT' ? 0 : 1);
      accumulator.totalScore = (accumulator.totalScore || 0) + item.score;
      accumulator.totalPosition = (accumulator.totalPosition || 0) + item.position;
      return accumulator;
    }, {});
    reducedPicks.avgPosition = reducedPicks.totalPosition / filteredPicks.length;

    return {
      id: user.id,
      username: user._doc.username,
      first_name: user._doc.first_name,
      last_name: user._doc.last_name,
      picks: filteredPicks,
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

server.listen(port, () => console.log(`Listening on port ${port}`));
