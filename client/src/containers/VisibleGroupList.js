import { connect } from 'react-redux'
import { groupsFetchData, groupsCanSave, savePicks, cancelPicks } from '../actions';
import TournamentGroupings from '../components/TournamentGroupings'

const getVisibleGroups = (groups, filter) => {
  switch (filter) {
    case 'SHOW_SAVED':
      return groups.map(group => group.filter(t => t.saved));
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
    fetchData: (url) => dispatch(groupsFetchData(url)),
    canSave: (bool) => dispatch(groupsCanSave(bool)),
    savePicks: (url, data) => dispatch(savePicks(url, data)),
    cancelPicks: () => dispatch(cancelPicks())
  };
}

const VisibleGroupList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentGroupings)

export default VisibleGroupList
