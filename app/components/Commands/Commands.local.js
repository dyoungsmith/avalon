import React, { Component } from 'react';
import _ from 'lodash';
import CommandsView from './Commands.view';

export default class CommandsLocal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      mordred: false,
      morgana: false,
      oberon: false,
      percival: false
    };

    this.methods = {
      handleChange: this.handleChange.bind(this),
      handleStartGame: this.handleStartGame.bind(this),
      handleProposeTeam: this.handleProposeTeam.bind(this)
    };
  }

  handleChange (evt) {
    const name = evt.target.name;
    this.setState({
      [name]: !this.state[name]
    });
  }

  handleStartGame () {
    const numPlayers = _.values(this.props.players).length;
    this.props.startGame(numPlayers, this.props.gameId);
  }

  // handleProposeTeam with necessary values
  handleProposeTeam () {
    this.props.proposeTeam(this.props.gameId);
  }

  render () {
    return (
      <CommandsView {...this.state} {...this.props} {...this.methods} />
    );
  }
}
