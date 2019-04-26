import { connect } from 'react-redux'
import { tournamentLeaderboardExpandRow } from '../actions';
import TournamentLeaderboard from '../components/TournamentLeaderboard'

const getVisibleLeaderboard = (leaderboard, filter) => {
  switch (filter) {
    case 'SHOW_MY_PICKS':
      return {...leaderboard, tournamentLeaderboard: leaderboard.tournamentLeaderboard.filter(l => l.selected)};
    case 'SHOW_ALL':
    default:
      return leaderboard
  }
}

const mapStateToProps = (state) => {
  return {
    leaderboard: getVisibleLeaderboard(state.leaderboard, state.leaderboardVisibilityFilter),
    hasErrored: state.leaderboardHasErrored,
    isLoading: state.leaderboardIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        expandTournamentLeaderboardRow: (id) => dispatch(tournamentLeaderboardExpandRow(id)),
    };
};

const VisibleLeaderboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentLeaderboard)

export default VisibleLeaderboard;
