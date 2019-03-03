import PlayerList from './PlayerList'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { groupsFetchData } from '../actions';


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
      <div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Groups);
