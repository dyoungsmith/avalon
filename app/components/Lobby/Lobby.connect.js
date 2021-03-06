'use strict';

import { connect } from 'react-redux';
import LobbyLocal from './Lobby.local.js';
import { createGame, updateGame } from '../../reducer/game.js';

export default connect(
	// mapStateToProps
	({ user, game }) => ({ user, game }),

	// mapDispatchToProps
	dispatch => ({
		createGame: user =>
			dispatch(createGame(user)),
		updateGame: (user, gameId) =>
			dispatch(updateGame(user, gameId))
	})
)(LobbyLocal);
