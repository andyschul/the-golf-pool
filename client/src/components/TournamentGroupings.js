import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { groupsFetchData } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PlayerList from './PlayerList'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class TournamentGroupings extends Component {
  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/${this.props.match.params.id}/picks?full=true`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/${this.props.match.params.id}/picks?full=true`);
    }
  }

  savePicks(groups) {
    let picks = [];
    for (let group of groups) {
      for (let player of group) {
        if (player.selected) {
          picks.push(player);
        }
      }
    }
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/${this.props.match.params.id}/picks`, {
      picks: picks
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  cancelPicks() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/${this.props.match.params.id}/picks?full=true`);
  }

  render() {
    const { groups } = this.props;
    return (
      <div>
        {groups.map((group, index) => (
          <PlayerList key={index} groupIndex={index} players={group} />
        ))}
      </div>
    );
  }
}

TournamentGroupings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    groups: state.groups,
    hasErrored: state.groupdsHasErrored,
    isLoading: state.groupdsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(groupsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TournamentGroupings));
