const axios = require('axios');
const redis = require('redis')
const schedule = require('node-schedule');
const {promisify} = require('util');
require('dotenv').config();

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const CONTESTS = ["The Open Championship", "U.S. Open", "Masters Tournament", "PGA Championship", "THE PLAYERS Championship"];

let j = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('A log per minute!');
});
console.log('at scheduler')


// REDIS CACHE FUNCTIONS
let rcf = {
  yearlyTournaments: function () {
    let currentYear = (new Date()).getFullYear();
    axios.get(`${process.env.SPORTS_RADAR_URI}/schedule/pga/${currentYear}/tournaments/schedule.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`)
      .then(function (response) {
        majors = response.data.tournaments.filter(x=>CONTESTS.includes(x.name));
        // TODO: set tournament data in redis properly
        // client.set(`tournaments:${currentYear}`, JSON.stringify({majors:majors}));
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  bar: function () {
    console.log('bar function')
  }
};


// GENERATE REDIS CACHE
getAsync(`tournaments:${(new Date()).getFullYear()}`).then(function(res) {
    if (!res) rcf.yearlyTournaments();
});


// SCHEDULERS
schedule.scheduleJob('0 0 1 1 *', function(){
  rcf.yearlyTournaments();
});
