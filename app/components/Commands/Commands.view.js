import React from 'react';
import _ from 'lodash';
import { isMyTurn } from '../utils';

const margin = { margin: '5px' };
const hide = { display: 'none' };

const checkNumPlayers = numPlayers => numPlayers < 5 || numPlayers > 10;

export default ({
  players,
  status,
  hostId,
  // mordred,
  // morgana,
  // oberon,
  // percival,
  user,
  turnOrder,
  currentTurn,
  proposedTeam,
  quests,
  currentQuest,
  handleChange,
  handleStartGame,
  handleProposeTeam
}) => {

  const numPlayers = players.length;
  const userId = user && user.id;
  const unableToStart = checkNumPlayers(numPlayers);
  const questMakerId = turnOrder[currentTurn];
  const myTurn = isMyTurn(players, user, questMakerId);
  const teamIsFull = quests[currentQuest].requiredPlayers === proposedTeam.length;

  return (
    <div>
      <h3>Commands</h3>
      <div className="flex flex-column">
      {
        hostId === userId && status === 'PREGAME' && !unableToStart
        <div>
          {/*
          <div style={hide}>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="mordred" onChange={handleChange} value={mordred} />
                Use Mordred
              </label>
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="morgana" onChange={handleChange} value={morgana} />
                Use Morgana
              </label>
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="oberon" onChange={handleChange} value={oberon} />
                Use Oberon
              </label>
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="percival" onChange={handleChange} value={percival} />
                Use Percival
              </label>
            </div>
          </div>
          */}
          <button className="btn btn-primary" style={margin} disabled={false} onClick={handleStartGame}>Start Game</button>
        </div>
      }
      {
        status === 'TEAMMAKE' && myTurn && teamIsFull &&
        <button className="btn btn-primary" style={margin} onClick={handleProposeTeam}>Propose Team</button>
      }
      {
        status === 'TEAMVOTE' &&
        <div>
          <button className="btn btn-success" style={margin}>Approve</button>
          <button className="btn btn-warning" style={margin}>Reject</button>
        </div>
      }
      {
        status === 'QUESTVOTE' &&
        <div>
          <button className="btn btn-success" style={margin}>Succeed</button>
          <button className="btn btn-danger" style={margin}>Fail</button>
        </div>
      }
      </div>
    </div>
  );
}
