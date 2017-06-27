import React, { Component } from 'react';
import update from 'immutability-helper';
import './App.css';

class Square extends Component {
  render() {
    return (
        <button className="square" onClick={() => this.props.onClick(this.props.item, this.props.player)} >
        {this.props.item}
      </button>
    );
  }
}

class Table extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {this.props.players.map((player) => <th key={player.name}>{player.name}</th>)}
          </tr>
        </thead>
        {this.props.categories.map((category) => {
          return (
            <tbody>
              <tr>
                <td>{category.title}</td>
              </tr>
              {category.items.map((item) => {
                return (
                  <tr key={item.name}>
                    <td>{item}</td>
                    {this.props.players.map((player) => <td key={item.name}><Square item={item} player={player} onClick={this.props.onClick} /></td>)}
                  </tr>
                )
              })}
            </tbody>
          )
        })}
      </table>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      state: {},
      players: [],
      categories: [
        { title: 'Characters', items: ['Green', 'Mustard', 'Peacock', 'Plum', 'Scarlet', 'White'] },
        { title: 'Weapons', items: ['Wrench', 'Candlestick', 'Dagger', 'Pistol', 'Lead Pipe', 'Rope'] },
        { title: 'Locations', items: ['Bathroom', 'Office', 'Dining Room', 'Game Room', 'Garage', 'Bedroom', 'Living Room', 'Kitchen', 'Courtyard'] }
      ]
    };
  }

  addPlayer(name) {
    this.setState((prevState) => {
      const id = prevState.players.length;

      return update(prevState, {
        state: { $merge: { [id]: {} } },
        players: { $push: [{ id: id, name: name }] }
      });
    });
  }

  componentDidMount() {
    this.addPlayer('Me')
    this.addPlayer('Mary')
    this.addPlayer('Mom')
  }

  handleClick(item, player) {
    console.log(item, player);
    const currentState = this.state.state[player.id][item];
    console.log(currentState);
  }

  render() {
    return (
        <Table players={this.state.players} categories={this.state.categories} onClick={(item, player) => this.handleClick(item, player)} />
    )
  }
}

export default Game;
