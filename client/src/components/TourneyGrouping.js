import PlayerList from './PlayerList'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { groupsFetchData } from '../actions';


class TourneyGrouping extends Component {
  componentDidMount() {
    console.log('getting data')
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/5c717a5ad6f7ed0006cc082b/tournaments/${this.props.tournament}/picks?full=true`);
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
    const { groups } = this.props
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
    return (
      <div>
      <div><button onClick={() => this.cancelPicks()}>Cancel</button></div>
      <div><button onClick={() => this.savePicks(groups)}>Save</button></div>
        {groups.map((group, index) => (
          <PlayerList key={index} groupIndex={index} players={group} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(TourneyGrouping);
