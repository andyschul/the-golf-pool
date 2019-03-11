const redis = require('redis')
const schedule = require('node-schedule');
const {promisify} = require('util');
const api = require('./api');
const email = require('./email');
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
      let teeTimesStartDay = new Date(tournamentStartDate.getTime());
      teeTimesStartDay.setDate(teeTimesStartDay.getDate() - 3);

      schedule.scheduleJob({ start: teeTimesStartDay, end: tournamentStartDate, rule: '0 */5 * * *' }, function(){
        api.getTeeTimes(tournament.id).then(data => {
          email.sendEmail({
            from: 'thegolfpoolhost@gmail.com',
            to: 'abschultz20@gmail.com',
            subject: 'Tee times was called',
            text: 'Tee times was called'
          })
          if (data.groups.length) {
            email.sendEmail({
              from: 'thegolfpoolhost@gmail.com',
              to: 'all',
              subject: `The ${tournament.name} tee times have been posted!`,
              text: `
                Visit thegolfpool.herokuapp.com to make your selections.\n
                You can change your picks anytime up until the first golfer tees off in each group.\n
                Good Luck!
              `
            })
            this.cancel();
          }
        });
      });
      console.log(`Created tee time scheduler: ${tournament.name} ${currentYear} starting ${teeTimesStartDay}`);

      let leaderboardStartDay = new Date(tournamentStartDate.getTime());
      leaderboardStartDay.setHours(leaderboardStartDay.getHours() + 19);
      schedule.scheduleJob({ start: leaderboardStartDay, rule: '0 */1 * * *' }, function(){
        api.getTournamentLeaderboard(tournament.id).then(data => {
          if (data.leaderboard.status === 'closed') {
            this.cancel();
          }
        });;
      });
      console.log(`Created leaderboard scheduler: ${tournament.name} ${currentYear} starting ${leaderboardStartDay}`);
    }
  }
}

createSchedulers();
