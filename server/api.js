const axios = require('axios');
const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL);
const CONTESTS = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];

// Ping heroku to keep app alive
setInterval(function() {
  axios.get("http://thegolfpool.herokuapp.com");
  console.log('pinging herokuapp')
}, 300000);

function groupPairings(pairings, groupNums) {
  let groupedPairings = [];
  let pLen = pairings.length;
  let remainder = pLen % groupNums;
  let ppg = pLen/groupNums;
  let max = Math.ceil(ppg);
  let min = Math.floor(ppg);

  for (let i=0; i<groupNums; i++) {
    let size = !remainder ? ppg : (i<remainder ? max : min);
    let group = pairings
                  .splice(0, size)
                  .map(g=>g.players.map(p=>({
                    tee_time: g.tee_time,
                    ...p
                  })))
                  .reduce((acc, val) => acc.concat(val), []);

    groupedPairings.push(group);
  }
  return groupedPairings;
}

function createPlayers(leaderboard) {
  return Object.assign({}, ...leaderboard.leaderboard.map(item => ({[item['id']]: item})));
}

function getYearlySchedule() {
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/schedule/pga/${currentYear}/tournaments/schedule.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      let tournaments = response.data.tournaments.filter(x=>CONTESTS.includes(x.name)).map(t=>(
        {
          id: t.id,
          name: t.name,
          start_date: t.start_date,
          end_date: t.end_date
        }
      ));
      client.set(`schedule:${currentYear}`, JSON.stringify({tournaments:tournaments}));
      for (let tournament of tournaments) {
        client.set(`tournaments:${tournament.id}`, JSON.stringify(tournament));
      }
      return {tournaments: tournaments};
    })
    .catch(function (error) {
      console.log('error getYearlySchedule', error);
      return {};
    });
}

function getTeeTimes(tournamentId) {
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/teetimes/pga/${currentYear}/tournaments/${tournamentId}/rounds/1/teetimes.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      if (response.data.round.courses.length) {
        let pairings = response.data.round.courses[0].pairings;
        let groups = groupPairings(pairings, 10);

        client.set(`tournaments:${tournamentId}:groups`, JSON.stringify({groups:groups}));
        return {groups: groups};
      }
      return {groups: []}
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return {groups: []};
    });
}

function getTournamentLeaderboard(tournamentId) {
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/leaderboard/pga/${currentYear}/tournaments/${tournamentId}/leaderboard.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      let leaderboard = response.data;
      client.set(`tournaments:${tournamentId}:leaderboard`, JSON.stringify({leaderboard:leaderboard}));
      client.set(`tournaments:${tournamentId}:players`, JSON.stringify(createPlayers(leaderboard)));
      return {leaderboard: leaderboard};
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return {};
    });
}

module.exports = { getYearlySchedule, getTeeTimes, getTournamentLeaderboard };
