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

function getEstimatedEarnings(players) {
  const percentages = {
    1: .18000,
    2: .10900,
    3: .06900,
    4: .04900,
    5: .04100,
    6: .03625,
    7: .03375,
    8: .03125,
    9: .02925,
    10: .02725,
    11: .02525,
    12: .02325,
    13: .02125,
    14: .01925,
    15: .01825,
    16: .01725,
    17: .01625,
    18: .01525,
    19: .01425,
    20: .01325,
    21: .01225,
    22: .01125,
    23: .01045,
    24: .00965,
    25: .00885,
    26: .00805,
    27: .00775,
    28: .00745,
    29: .00715,
    30: .00685,
    31: .00655,
    32: .00625,
    33: .00595,
    34: .00570,
    35: .00545,
    36: .00520,
    37: .00495,
    38: .00475,
    39: .00455,
    40: .00435,
    41: .00415,
    42: .00395,
    43: .00375,
    44: .00355,
    45: .00335,
    46: .00315,
    47: .00295,
    48: .00279,
    49: .00265,
    50: .00257,
    51: .00251,
    52: .00245,
    53: .00241,
    54: .00237,
    55: .00235,
    56: .00233,
    57: .00231,
    58: .00229,
    59: .00227,
    60: .00225,
    61: .00223,
    62: .00221,
    63: .00219,
    64: .00217,
    65: .00215
  };

  let newPercentages = {};
  let count = {};

  for (let p of players) {
      if (!count.hasOwnProperty(p.position)) {
          count[p.position] = 0;
      }
      count[p.position]++;
  }

  for (let c in count) {
    let n = Number(c);
    if (!percentages.hasOwnProperty(n)) {
      newPercentages[c] = 0
      continue;
    }
    let totPercentage = 0;
    for (let step = n; step < n + count[c]; step++) {
        totPercentage += percentages[step];
    }
    newPercentages[c] = totPercentage / count[c];
  }
  return newPercentages;
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

  const earningsMap = getEstimatedEarnings(leaderboard.purse, leaderboard.leaderboard);

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
        estMoney: Math.round(leaderboard.purse * earningsMap[players[player.id].position]),
        strokes: players[player.id].strokes,
      }
    });
    let filteredPicks = picks.filter((pick) => (pick != null));

    filteredPicks.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));

    reducedPicks = filteredPicks.reduce((accumulator, item) => {
      accumulator.totalMoney = (accumulator.totalMoney || 0) + item.money || 0;
      accumulator.totalEstMoney = (accumulator.totalEstMoney || 0) + item.estMoney || 0;
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
    leaderboardData.sort((a,b) => (a.totalEstMoney > b.totalEstMoney) ? -1 : ((b.totalEstMoney > a.totalEstMoney) ? 1 : 0))

  let l = leaderboard.leaderboard.reduce((obj, item) => {
    obj[item.id] = {...item, selected: userPlayerIds.includes(item.id), picks: [], estMoney: Math.round(leaderboard.purse * earningsMap[item.position])};
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
