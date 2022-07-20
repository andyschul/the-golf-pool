require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const schedule = require('node-schedule');
const { DateTime } = require("luxon");
const api = require('./api');
const email = require('./email');
const schedulers = [];

const tzConversion = {
  'US/Eastern': 'America/New_York',
  'US/Arizona': 'America/Phoenix',
  'US/Pacific': 'America/Los_Angeles',
  'US/Central': 'America/Chicago',
  'US/Hawaii': 'Pacific/Honolulu'
}

async function createSchedulers(year) {
  let tournamentSchedule = await api.getYearlySchedule(year);
  if (!tournamentSchedule) {
    console.error('Could not get schedule');
    return;
  }
  for (let tournament of tournamentSchedule.tournaments) {
    let tz = tzConversion[tournament.course_timezone] || tournament.course_timezone;
    let tournamentStartDate = DateTime.fromSQL(tournament.start_date, { zone: tz });
    let tournamentEndDate = DateTime.fromSQL(tournament.end_date, { zone: tz });
    let teeTimesStartDate = tournamentStartDate.minus({ days: 3 })
    let leaderboardEndDate = tournamentEndDate.plus({ days: 2 })

    let teeTimeRule = new schedule.RecurrenceRule();
    teeTimeRule.hour = [8, 12, 16];
    teeTimeRule.minute = 0;
    let teeTimeSchedule = schedule.scheduleJob({ start: teeTimesStartDate, end: tournamentStartDate, rule: teeTimeRule, tz: tz }, async function(){
      let teeTimes = await api.getTeeTimes(tournament.id);
      if (teeTimes.length) {
        email.sendEmail({
          to: 'abschultz20@gmail.com',
          from: 'thegolfpoolnoreply@gmail.com',
          subject: `${tournament.name} tee times are out!`,
          html: '<strong>Visit https://thegolfpool.herokuapp.com to make your selections!</strong>',
        });
        this.cancel();
      }
    });
    schedulers.push(teeTimeSchedule);

    let leaderboardRule = new schedule.RecurrenceRule();
    leaderboardRule.minute = [0, 20, 40];
    leaderboardRule.hour = [new schedule.Range(9, 21)];
    let leaderboardSchedule = schedule.scheduleJob({ start: tournamentStartDate, end: leaderboardEndDate, rule: leaderboardRule, tz: tz }, async function(){
      let leaderboard = await api.getLeaderboard(tournament.id);
      if (leaderboard && leaderboard.status === 'closed') {
        this.cancel();
      }
    });
    schedulers.push(leaderboardSchedule);
  }
}

schedule.scheduleJob('0 0 1 1 *', function(){
  let currentYear = (new Date()).getFullYear();
  createSchedulers(currentYear);
});

createSchedulers((new Date()).getFullYear());

console.log('started')
