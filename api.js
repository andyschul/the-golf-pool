const axios = require('axios');
const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL);
const CONTESTS = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];


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
      // TODO: create a list of lists for pairings
      let pairings = response.data.round.courses[0].pairings

      client.set(`tournament:${tourneyId}:pairings`, JSON.stringify({pairings:pairings}));
      return {pairings: pairings};
    })
    .catch(function (error) {
      console.log('error getTeeTimes', error);
      return {};
    });
}

module.exports = { getYearlySchedule, getTeeTimes };
