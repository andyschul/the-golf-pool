import { connect } from 'react-redux'
import { togglePlayer } from '../actions'
import PlayerList from '../components/PlayerList'


const mapStateToProps = state => ({
  players: state.players
})

const mapDispatchToProps = dispatch => ({
  togglePlayer: id => dispatch(togglePlayer(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerList)
