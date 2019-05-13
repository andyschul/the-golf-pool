import { connect } from 'react-redux'
import { groupsCanSave, cancelPicks } from '../actions';
import TournamentGroupings from '../components/TournamentGroupings'

const getVisibleGroups = (groups, filter) => {
  switch (filter) {
    case 'SHOW_SAVED':
      return {
        ...groups,
        picks: groups.picks.map(group => group.filter(t => t.saved))
      }
    case 'SHOW_ALL':
    default:
      return groups
  }
}

const mapStateToProps = state => {
  return {
    groups: getVisibleGroups(state.groups, state.groupVisibilityFilter),
    hasErrored: state.groupsHasErrored,
    isLoading: state.groupsIsLoading,
    groupsCanSave: state.groupsCanSave
  }
}

const mapDispatchToProps = dispatch => {
  return {
    canSave: (bool) => dispatch(groupsCanSave(bool)),
    cancelPicks: () => dispatch(cancelPicks())
  };
}

const VisibleGroupList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentGroupings)

export default VisibleGroupList
