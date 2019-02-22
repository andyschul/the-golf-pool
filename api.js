const axios = require('axios');
const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL);
const CONTESTS = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];

function groupPairings(pairings, groupNums) {
  let groupedPairings = [];
  let pLen = pairings.length;
  let remainder = pLen % groupNums;
  let ppg = pLen/groupNums;
  let max = Math.ceil(ppg);
  let min = Math.floor(ppg);

  for (let i=0; i<groupNums; i++) {
    let size = !remainder ? ppg : (i<remainder ? max : min)
    groupedPairings.push(pairings.splice(0, size));
  }
  return groupedPairings;
}

function getYearlySchedule() {
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/schedule/pga/${currentYear}/tournaments/schedule.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      let tournaments = response.data.tournaments.filter(x=>CONTESTS.includes(x.name)).map(x=>(
        {
          id: x.id,
          name: x.name,
          start_date: x.start_date
        }
      ));
      client.set(`schedule:${currentYear}`, JSON.stringify({tournaments:tournaments}));
      return {tournaments: tournaments};
    })
    .catch(function (error) {
      console.log('error getYearlySchedule', error);
      return {};
    });
}

function getTeeTimes() {
  let currentYear = (new Date()).getFullYear();
  return axios.get(`${process.env.SPORTS_RADAR_URI}/teetimes/pga/${currentYear}/tournaments/${tourneyId}/rounds/1/teetimes.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
    .then(function (response) {
      let pairings = response.data.round.courses[0].pairings;
      let groups = groupPairings(pairings, 10);

      client.set(`tournament:${tourneyId}:groups`, JSON.stringify({groups:groups}));
      return {groups: groups};
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return {};
    });
}

module.exports = { getYearlySchedule, getTeeTimes };
