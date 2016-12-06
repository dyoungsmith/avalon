import store from './store';

/** Dummy zone  */
import { receiveGames } from './reducers/games';
import { joinGame } from './reducers/game';
import { toggleOptional, playLadyCard } from './reducers/game/rules';
import { addPlayerToGame } from './reducers/game/players';
import { addToTeam, removeFromTeam, proposeTeam, voteOnTeam, scoreTeamVotes, voteOnQuest, scoreAndEndQuest } from './reducers/game/quests';
/** End dummy zone */


window.store = store;

console.log('hello avalon');

const DUMMY_GAMES = {
  1: {
    id: 1,
    name: "Tom's Game",
    hostId: 1,
    players: {},
    quests: {
      1: {
        requiredPlayers: 0,
        numberOfSuccessesNeeded: 0,
        numberOfFailsNeeded: 0,
        successVotes: 0,
        failVotes: 0
      },
      2: {
        requiredPlayers: 0,
        numberOfSuccessesNeeded: 0,
        numberOfFailsNeeded: 0,
        successVotes: 0,
        failVotes: 0
      },
      3: {
        requiredPlayers: 0,
        numberOfSuccessesNeeded: 0,
        numberOfFailsNeeded: 0,
        successVotes: 0,
        failVotes: 0

      },
      4: {
        requiredPlayers: 0,
        numberOfSuccessesNeeded: 0,
        numberOfFailsNeeded: 0,
        successVotes: 0,
        failVotes: 0

      },
      5: {
        requiredPlayers: 0,
        numberOfSuccessesNeeded: 0,
        numberOfFailsNeeded: 0,
        successVotes: 0,
        failVotes: 0
      },
      currentQuest: 1,
      loyalScore: 0,
      evilScore: 0
    }
  },
   2: {
    id: 2,
    name: "Dani's Game",
    players: {}
  }
};

const DUMMY_USERS = {
  1: {
    id: 1,
    name: 'Dani'
  },
  2: {
    id: 2,
    name: 'Tom'
  },
  3: {
    id: 3,
    name: 'Omri'
  },
  4: {
    id: 4,
    name: 'Eliot'
  },
  5: {
    id: 5,
    name: 'Geoff'
  }
};

const DUMMY_GAME = DUMMY_GAMES[1];

store.dispatch(receiveGames(DUMMY_GAMES));
store.dispatch(joinGame(DUMMY_GAME));
for (let i = 1; i <= 5; i++)
  store.dispatch(addPlayerToGame(DUMMY_USERS[i]));
store.dispatch(toggleOptional('mordred'));
store.dispatch({ type: 'START_GAME' });

// store.dispatch(proposeTeam());

// Quest 1: fail
store.dispatch(addToTeam(DUMMY_USERS[5]));
store.dispatch(voteOnTeam(false));  // team.failVotes = 1
store.dispatch(scoreTeamVotes());
// store.dispatch(voteOnQuest(true));
// store.dispatch(voteOnQuest(false));
store.dispatch(scoreAndEndQuest());

// Quest 2: succeed
store.dispatch(addToTeam(DUMMY_USERS[1]));
store.dispatch(addToTeam(DUMMY_USERS[3]));
store.dispatch(removeFromTeam(DUMMY_USERS[3]));
store.dispatch(playLadyCard(DUMMY_USERS[3]));
// store.dispatch(voteOnTeam(true)); // team.successVotes = 1
// store.dispatch(scoreTeamVotes());
// store.dispatch(voteOnQuest(true));
// store.dispatch(scoreAndEndQuest());
