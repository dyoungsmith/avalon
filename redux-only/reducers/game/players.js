import _ from 'lodash';
import store from '../../store';
import { ADD_PLAYER_TO_GAME, START_GAME } from '../../constants';

// -------------------------- DEFAULTS --------------------------
const DEFAULT_PLAYER = {
  loyal: true,
  characterName: '',
  characterImgUrl: ''
};

const DEFAULT_PLAYERS = {};

// -------------------------- HELPERS --------------------------
function assignCharacters ({ game: { rules }}, players) {
  const numPlayers = rules.numberOfPlayers;
  const specialChars = rules.characters;
  const _PLAYERS = Object.assign({}, players);

  let chars = [];
  let good = 0;
  let bad = 0;

  // determine number of good and bad characters
  if (numPlayers === 5) {
    good += 3;
    bad += 2;
  } else if (numPlayers === 6) {
    good += 4;
    bad += 2;
  } else if (numPlayers === 7) {
    good += 4;
    bad += 3
  } else if (numPlayers === 8) {
    good += 5;
    bad += 3;
  } else if (numPlayers === 9) {
    good += 6;
    bad += 3
  } else {
    good += 6;
    bad += 4;
  }

  // add special characters
  if (specialChars.percival) {
    chars.push({
      loyal: 'good',
      characterName: 'Percival',
      characterImgUrl: '/icons/percival.png'
    });
    good--;
  }
  if (specialChars.mordred && bad > 1) {
    chars.push({
      loyal: 'evil',
      characterName: 'Mordred',
      characterImgUrl: '/icons/mordred.png'
    });
    bad--;
  }
  if (specialChars.morgana && bad > 1) {
    chars.push({
      loyal: 'evil',
      characterName: 'Morgana',
      characterImgUrl: '/icons/morgana.png'
    });
    bad--;
  }
  if (specialChars.oberon && bad > 1) {
    chars.push({
      loyal: 'evil',
      characterName: 'Oberon',
      characterImgUrl: '/icons/oberon.png'
    });
    bad--;
  }

  // add remaining characters, including assassin and merlin
  chars.push({
    loyal: 'evil',
    characterName: 'assassin',
    characterImgUrl: '/icons/assassin.png'
  });
  bad--;
  chars.push({
    loyal: 'good',
    characterName: 'Merlin',
    characterImgUrl: '/icons/merlin.png'
  });
  good--;

  // fill in with servants or minions
  while (good > 0) {
    chars.push({
      loyal: 'good',
      characterName: 'Servant of Arthur',
      characterImgUrl: `/icons/loyal_${good}.png`
    });
    good--;
  }
  while (bad > 0) {
    chars.push({
      loyal: 'evil',
      characterName: 'Minion of Mordred',
      characterImgUrl: `/icons/minion_${bad}.png`
    });
    bad--;
  }

  // shuffle characters
  chars = _.shuffle(chars);

  // assign characters to players
  Object.keys(_PLAYERS).map(playerId => {
    let charIdx = 0;
    _PLAYERS[playerId] = Object.assign({}, _PLAYERS[playerId], chars[charIdx]);
    charIdx++;
  });

  return _PLAYERS;
};

// ---------------------- ACTION CREATORS ----------------------
export const addPlayerToGame = player => ({
  type: ADD_PLAYER_TO_GAME,
  player
});

// -------------------------- REDUCER --------------------------
export default function (state = DEFAULT_PLAYERS, action) {
  switch (action.type) {
    case START_GAME: return assignCharacters(store.getState(), state);
    case ADD_PLAYER_TO_GAME: return Object.assign({}, state, {
      [action.player.id]: Object.assign({}, action.player, DEFAULT_PLAYER)
    });

    default: return state;
  }
};
