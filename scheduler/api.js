const redis = require('redis')
const {promisify} = require('util');
const axios = require('axios');
require('dotenv')
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const { sendEmail } = require('./email');

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

async function getYearlySchedule(year) {
  let schedule = await getAsync(`schedule:${year}`);
  if (schedule) {
    return JSON.parse(schedule);
  }
  const CONTESTS = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];
  return axios.get(`${process.env.SPORTS_RADAR_URI}/schedule/pga/${year}/tournaments/schedule.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      let tournaments = response.data.tournaments.filter(x=>CONTESTS.includes(x.name));
      client.set(`schedule:${year}`, JSON.stringify({tournaments:tournaments}));
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

async function getLeaderboard(tournamentId) {
  let leaderboard = await getAsync(`tournaments:${tournamentId}:leaderboard`);
  if (leaderboard) {
    let lb = JSON.parse(leaderboard);
    if (lb.status === 'closed') {
      return lb
    }
  }
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/leaderboard/pga/${currentYear}/tournaments/${tournamentId}/leaderboard.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      if (response.data.leaderboard) {
        let leaderboard = JSON.stringify(response.data)
        let players = JSON.stringify(createPlayers(response.data))
        client.set(`tournaments:${tournamentId}:leaderboard`, leaderboard);
        client.set(`tournaments:${tournamentId}:players`, players);
        return response.data.leaderboard;
      }
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return;
    });
}

async function getTeeTimes(tournamentId) {
  let teeTimes = await getAsync(`tournaments:${tournamentId}:groups`);
  if (teeTimes) {
    return JSON.parse(teeTimes);
  }
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/teetimes/pga/${currentYear}/tournaments/${tournamentId}/rounds/1/teetimes.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(async function (response) {
      if (response.data.round && response.data.round.courses.length) {
        let pairings = response.data.round.courses[0].pairings;
        let groups = groupPairings(pairings, 10);
        client.set(`tournaments:${tournamentId}:groups`, JSON.stringify(groups));
        await sendEmail({
          senderAddress: "<TheGolfPool@9beec9a2-80be-49da-b674-99cf2949b2df.azurecomm.net>",
          content: {
            subject: `Tee times for ${tournament.name} have been posted!`,
            plainText: "Visit https://thegolfpool.azurewebsites.net to make your selections",
          },
          recipients: {
            to: 'all',
          },
        });
        return groups;
      }
      return [];
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return [];
    });
}

module.exports = { getYearlySchedule, getTeeTimes, getLeaderboard };
