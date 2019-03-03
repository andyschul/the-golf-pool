import PropTypes from 'prop-types'
import Player from './Player'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { playersFetchData } from '../actions';
import { selectPlayer } from '../actions';




class Groups extends Component {
  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/groupings`);
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
      <ul>
        {groups.map((group, index) => (
          <PlayerList key={index} {...group} />
        ))}
      </ul>
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
        fetchData: (url) => dispatch(playersFetchData(url))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Groups);
