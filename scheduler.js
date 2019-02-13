const axios = require('axios');
const redis = require('redis')
const schedule = require('node-schedule');
const {promisify} = require('util');
const api = require('./api');
require('dotenv').config();

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);


// GET TOURNAMENT SCHEDULE ONCE PER YEAR
schedule.scheduleJob('0 0 0 0 *', function(){
  api.getYearlySchedule();
});


// CREATE INDIVIDUAL TOURNAMENT SCHEDULERS
getAsync(`schedule:${currentYear}`).then(function(res) {
  if (res) {
    let tourneySchedule = JSON.parse(res);
  } else {
    let tourneySchedule = api.getYearlySchedule();
  }

  let now = new Date();
  for (let tourney of tourneySchedule.tournaments) {
    if (new Date(tourney.start_date) > now) {
      // TODO: create cron from tourney.start_date
      let cron;

      schedule.scheduleJob(cron, function(){
        let teeTimes = api.getTeeTimes(tourney.id);
        if (teeTimes.hasOwnPropery('pairings')) {
          this.cancel();
        }
      });
    }
  }
});
