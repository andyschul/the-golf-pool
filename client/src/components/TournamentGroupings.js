import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { groupsFetchData } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PlayerList from './PlayerList'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

class TournamentGroupings extends Component {
  componentDidMount() {
    console.log('getting data')
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/b404a8d5-5e33-4417-ae20-5d4d147042ee/picks?full=true`);
  }

  componentDidUpdate() {
    console.log('updated')
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
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/b404a8d5-5e33-4417-ae20-5d4d147042ee/picks`, {
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
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/b404a8d5-5e33-4417-ae20-5d4d147042ee/picks?full=true`);
  }

  render() {
    const { classes, groups } = this.props;
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
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
