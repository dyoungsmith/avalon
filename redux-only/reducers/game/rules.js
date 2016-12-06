import { combineReducers } from 'redux';
import store from '../../store';
import { ADD_PLAYER_TO_GAME, TOGGLE_OPTIONAL, START_GAME, PLAY_LADY_CARD } from '../../constants';


// -------------------------- DEFAULTS --------------------------
const DEFAULT_CHARACTERS = {
  mordred: false,
  percival: false,
  morgana: false,
  oberon: false,
  ladyOfTheLake: 0,
  previousLadies: {}
};

// -------------------------- HELPERS --------------------------
function setFirstLady ({ game }, characters) {
  const _CHARACTERS = characters;
  const playerIds = Object.keys(game.players);
  const lastPlayerId = playerIds[playerIds.length - 1];

  _CHARACTERS.ladyOfTheLake = +lastPlayerId;

  return _CHARACTERS;
};

function lady ({ game: { rules: { characters }}}, player) {
  const _CHARACTERS = characters;
  const _PREVLADIES = _CHARACTERS.previousLadies;
  // deal with showing loyal or minion to previous lady

  if (!_PREVLADIES[player.id]) {
    _CHARACTERS.previousLadies = Object.assign(
      {},
      _PREVLADIES,
      { [_CHARACTERS.ladyOfTheLake]: true }
    );
  }

  _CHARACTERS.ladyOfTheLake = player.id;

  return _CHARACTERS
};

// ---------------------- ACTION CREATORS ----------------------
export const toggleOptional = character => ({
  type: TOGGLE_OPTIONAL,
  character
});

export const playLadyCard = player => ({
  type: PLAY_LADY_CARD,
  player
});

// -------------------------- REDUCERS --------------------------
const numberOfPlayers = (state = 0, action) => {
  switch (action.type) {
    case ADD_PLAYER_TO_GAME: return ++state;
    default: return state;
  }
};

const characters = (state = DEFAULT_CHARACTERS, action) => {
  switch (action.type) {
    case START_GAME: return setFirstLady(store.getState(), state);
    case TOGGLE_OPTIONAL: return Object.assign({}, state, {
      [action.character]: !state[action.character]
    });
    case PLAY_LADY_CARD: return lady(store.getState(), action.player);
    default: return state;
  }
};

export default combineReducers({
  numberOfPlayers,
  characters
});
