import React from 'react';
import _ from 'lodash';
import Players from '../Players';
import ControlPanel from '../ControlPanel';

const marginTop = { marginTop: '20px' };
const bottomLeft = { position: 'fixed', bottom: '10px', left: '10px' };

export default ({
  roomId
}) => {

  return (
    <div className="container" style={marginTop}>
      <h5 style={bottomLeft}>You are in room: <span className="well well-sm">{ roomId }</span></h5>
      <Players />
      <ControlPanel />
    </div>
  );
};
