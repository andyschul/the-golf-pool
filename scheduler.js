const redis = require('redis')
const schedule = require('node-schedule');
const {promisify} = require('util');
const api = require('./api');
require('dotenv').config();

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

// TRIGGER TOURNAMENT SCHEDULER CREATION ONCE PER YEAR
schedule.scheduleJob('0 0 1 1 *', function(){
  createSchedulers();
});
console.log(`Created scheduler: Yearly Tournament Scheduler`);

// CREATE INDIVIDUAL TOURNAMENT SCHEDULERS
async function createSchedulers() {
  let currentYear = (new Date()).getFullYear();
  let tournamentSchedule;
  let res = await getAsync(`schedule:${currentYear}`);
  if (res) {
    tournamentSchedule = JSON.parse(res);
  } else {
    tournamentSchedule = await api.getYearlySchedule();
  }
  if (!tournamentSchedule.hasOwnProperty('tournaments')) {
    console.error('Could not get tournament schedule');
    return;
  }

  let now = new Date();
  for (let tournament of tournamentSchedule.tournaments) {
    let tournamentStartDate = new Date(`${tournament.start_date}T00:00:00`);
    let tournamentEndDate = new Date(`${tournament.end_date}T00:00:00`);
    if (tournamentStartDate > now) {
      // Create scheduler to run every 5th hour, starting 3 days prior to tournament
      let startDay = new Date(tournamentStartDate.getTime());
      startDay.setDate(startDay.getDate() - 3);

      schedule.scheduleJob({ start: startDay, end: tournamentStartDate, rule: '0 */5 * * *' }, function(){
        let teeTimes = api.getTeeTimes(tournament.id);
        if (teeTimes.hasOwnPropery('pairings')) {
          this.cancel();
        }
      });
      console.log(`Created tee time scheduler: ${tournament.name} ${currentYear}`);

      let leaderboardStartDay = new Date(tournamentStartDate.getTime());
      leaderboardStartDay.setDate(leaderboardStartDay.getDate() + 1);

      schedule.scheduleJob({ start: leaderboardStartDay, rule: '0 */2 * * *' }, function(){
        let leaderboard = api.getTournamentLeaderboard(tournament.id);
        if (leaderboard.leaderboard.status === 'closed') {
          this.cancel();
        }
      });
      console.log(`Created leaderboard scheduler: ${tournament.name} ${currentYear}`);
    }
  }
}

createSchedulers();
