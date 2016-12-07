import React from 'react';
import _ from 'lodash';

const margin = { margin: '5px' };
const hide = { display: 'none' };

const checkNumPlayers = numPlayers => numPlayers < 5 || numPlayers > 10;

export default ({
  players,
  status,
  hostId,
  mordred,
  morgana,
  oberon,
  percival,
  user,
  handleChange,
  handleStartGame
}) => {

  const numPlayers = _.values(players).length;
  const userId = user && user.id;
  const unableToStart = checkNumPlayers(numPlayers);

  return (
    <div>
      <h3>Commands</h3>
      <div className="flex flex-column">
      {
        hostId === userId && status === 'PREGAME' &&
        <div>
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
          <button className="btn btn-primary" style={margin} disabled={false} onClick={handleStartGame}>Start Game</button>
        </div>
      }
      {
        status === 'ONQUEST' &&
        <div>
          <button className="btn btn-success" style={margin}>Succeed</button>
          <button className="btn btn-danger" style={margin}>Fail</button>
        </div>
      }
      {
        status === 'VOTE' &&
        <div>
          <button className="btn btn-success" style={margin}>Approve</button>
          <button className="btn btn-warning" style={margin}>Reject</button>
        </div>
      }
      {
        status === 'PREQUEST' &&
        <button className="btn btn-primary" style={margin}>Go on Quest</button>
      }
      </div>
    </div>
  );
}
