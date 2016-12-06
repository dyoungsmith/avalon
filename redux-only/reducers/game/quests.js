import store from '../../store';
import { START_GAME, ADD_TO_TEAM, REMOVE_FROM_TEAM, PROPOSE_TEAM, VOTE_ON_TEAM, SCORE_TEAM_VOTES, VOTE_ON_QUEST, SCORE_AND_END_QUEST } from '../../constants';


// -------------------------- DEFAULTS --------------------------
const DEFAULT_TEAM = {
  successVotes: 0,
  failVotes: 0
};

const DEFAULT_QUEST = {
  requiredPlayers: 0,   // === numberOfSuccessesNeeded
  numberOfFailsNeeded: 0,
  successVotes: 0,
  failVotes: 0,
  team: DEFAULT_TEAM,
  teamFails: 0
};

const DEFAULT_QUESTS = {
  1: DEFAULT_QUEST,
  2: DEFAULT_QUEST,
  3: DEFAULT_QUEST,
  4: DEFAULT_QUEST,
  5: DEFAULT_QUEST,
  currentQuest: 1,
  currentLeader: 0,
  loyalScore: 0,
  evilScore: 0
};

// -------------------------- HELPERS --------------------------
const initializeQuests = ({ game }) => {
  const numberOfPlayers = game.rules.numberOfPlayers;
  const five = [1, 2, 3, 4, 5];
  const _QUESTS = {};
  five.map(i => {
    switch (i) { // switch on quest number
      case 1:
        if (numberOfPlayers < 8) _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 2,
          numberOfFailsNeeded: 1
        });
        else _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 3,
          numberOfFailsNeeded: 1
        });
      
      case 2:
        if (numberOfPlayers < 8) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 3,
          numberOfFailsNeeded: 1
        });
        else _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 4,
          numberOfFailsNeeded: 1
        });

      case 3:
        if (numberOfPlayers === 5) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 2,
          numberOfFailsNeeded: 1
        });
        else if (numberOfPlayers === 6) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 4,
          numberOfFailsNeeded: 1
        });
        else if (numberOfPlayers === 7) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 3,
          numberOfFailsNeeded: 1
        });
        else _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 4,
          numberOfFailsNeeded: 1
        });

      case 4:
        if (numberOfPlayers < 7) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 3,
          numberOfFailsNeeded: 1
        });
        else if (numberOfPlayers === 7) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 4,
          numberOfFailsNeeded: 2
        });
        else _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 5,
          numberOfFailsNeeded: 2
        });

      case 5:
        if (numberOfPlayers === 5) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 3,
          numberOfFailsNeeded: 1
        });
        else if (numberOfPlayers < 8) _QUESTS[i] = Object.assign({},
          DEFAULT_QUEST, {
          requiredPlayers: 4,
          numberOfFailsNeeded: 1
        });
        else _QUESTS[i] = Object.assign({}, DEFAULT_QUEST, {
          requiredPlayers: 5,
          numberOfFailsNeeded: 1
        });
    }
  });

  const playerIds = Object.keys(game.players);
  const firstLeaderId = playerIds[0];

  _QUESTS.currentLeader = +firstLeaderId;

  return Object.assign({}, DEFAULT_QUESTS, _QUESTS);
};

function addPlayerToTeam(quests, player) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURQUEST = _QUESTS[_QNUMBER];

  _QUESTS[_QNUMBER].team = Object.assign({}, _CURQUEST.team, {
    [player.id]: player
  });

  return _QUESTS;
};

function removePlayerFromTeam(quests, player) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURTEAM = _QUESTS[_QNUMBER].team;
  const teamToUpdate = Object.assign({}, _CURTEAM);

  delete teamToUpdate[player.id];

  _QUESTS[_QNUMBER].team = teamToUpdate;

  return _QUESTS;
};

function addVoteToTeam (quests, voteType) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURTEAM = _QUESTS[_QNUMBER].team;
  const fieldToUpdate = voteType ? 'successVotes' : 'failVotes';

  _QUESTS[_QNUMBER].team = Object.assign({}, _CURTEAM, {
    [fieldToUpdate]: ++_CURTEAM[fieldToUpdate]
  });

  return _QUESTS;
};

function getNextLeaderId (game) {
  // num = currIdx + 1; m = arr.length
  const mod = (num, m) => ((num % m) + m) % m;
  const playerIds = Object.keys(game.players);  // string IDs
  const currLeaderId = game.quests.currentLeader.toString();
  const currLeaderIdx = playerIds.indexOf(currLeaderId);
  const nextIdx = mod((currLeaderIdx + 1), playerIds.length);
  const nextId = playerIds[nextIdx];

  return +nextId;  // num
};

function tallyTeamVotes ({ game }, quests) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURQUEST = _QUESTS[_QNUMBER]; 
  const _CURTEAM = _QUESTS[_QNUMBER].team;

  const didSucceed = _CURTEAM.successVotes > _CURTEAM.failVotes;

  if (!didSucceed) {
    _QUESTS[_QNUMBER].teamFails = ++_QUESTS[_QNUMBER].teamFails;
    if (_QUESTS[_QNUMBER].teamFails >= 5) {
      console.log('GAME OVER! EVIL WINS');
    }
    else {
      const nextLeaderId = getNextLeaderId(game);
      _QUESTS.currentLeader = nextLeaderId;
      _QUESTS[_QNUMBER] = Object.assign({}, _CURQUEST, {
        team: DEFAULT_TEAM
      });
    }
  }
  else {
    _QUESTS[_QNUMBER].team = Object.assign({}, _CURTEAM, { didSucceed });
  }

  return _QUESTS;
};

function addVoteToQuests (quests, voteType) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURQUEST = _QUESTS[_QNUMBER];
  const fieldToUpdate = voteType ? 'successVotes' : 'failVotes';

  _QUESTS[_QNUMBER] = Object.assign({}, _CURQUEST, {
    [fieldToUpdate]: ++_CURQUEST[fieldToUpdate]
  });

  return _QUESTS;
};

function tallyQuestAndContinue ({ game }, quests) {
  const _QUESTS = Object.assign({}, quests);
  const _QNUMBER = _QUESTS.currentQuest;
  const _CURQUEST = _QUESTS[_QNUMBER];
  const didSucceed = _CURQUEST.failVotes < _CURQUEST.numberOfFailsNeeded;
  const gameScoreToUpdate = didSucceed ? 'loyalScore' : 'evilScore';

  _QUESTS[_QNUMBER] = Object.assign({}, _CURQUEST, { didSucceed });
  _QUESTS[gameScoreToUpdate] = ++_QUESTS[gameScoreToUpdate];
  
  if (_QUESTS.currentQuest < 5) {
    _QUESTS.currentQuest = ++_QUESTS.currentQuest;
    const nextLeaderId = getNextLeaderId(game);
    _QUESTS.currentLeader = nextLeaderId;
  };

  return _QUESTS;
};

// ---------------------- ACTION CREATORS ----------------------
export const addToTeam = (player) => ({
  type: ADD_TO_TEAM,
  player
});

export const removeFromTeam = (player) => ({
  type: REMOVE_FROM_TEAM,
  player
});

// export const proposeTeam = (team) => ({ // send to FB to update all players
//   type: PROPOSE_TEAM,
//   team
// });

export const voteOnTeam = (voteType) => ({
  type: VOTE_ON_TEAM,
  voteType
});

export const scoreTeamVotes = () => ({
  type: SCORE_TEAM_VOTES,
});

export const voteOnQuest = (voteType) => ({
  type: VOTE_ON_QUEST,
  voteType
});

// run this dispatch once fb listener hears totalCount === numPlayers
export const scoreAndEndQuest = () => ({
  type: SCORE_AND_END_QUEST
});


// -------------------------- REDUCER --------------------------
export default (state = DEFAULT_QUESTS, action) => {
  switch (action.type) {
    // All quests
    case START_GAME: return initializeQuests(store.getState());


    // Current quest's team
    case ADD_TO_TEAM: return addPlayerToTeam(state, action.player);
    case REMOVE_FROM_TEAM: return removePlayerFromTeam(state, action.player);
    // case PROPOSE_TEAM: return Object.assign({}, state, {  // fb
    //   team: action.team
    // });
    case VOTE_ON_TEAM: return addVoteToTeam(state, action.voteType);
    case SCORE_TEAM_VOTES: return tallyTeamVotes(store.getState(), state);


    // Current quest
    case VOTE_ON_QUEST: return addVoteToQuests(state, action.voteType);
    case SCORE_AND_END_QUEST: return tallyQuestAndContinue(store.getState(), state);

    default: return state;
  }
};
