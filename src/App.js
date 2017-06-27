import React, { Component } from 'react';
import update from 'immutability-helper';
import './App.css';

class Square extends Component {
  render() {
    return (
      <button data-state={this.props.stateLabel} disabled={this.props.itemState === -1} onClick={() => this.props.onClick(this.props.item, this.props.player)} >
        <span></span>
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
                  <tr>
                    <td>{item.name}</td>
                    <td>{this.props.itemStates.overall[item.id]}</td>
                    {this.props.players.map((player) => {
                      var state = this.props.itemStates[player.id][item.id];
                      return <td><Square item={item} player={player} onClick={this.props.onClick} itemState={state} stateLabel={this.props.stateMap[state]} /></td>
                    })}
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
    this.itemCount = 0;
    this.stateMap = {
      0: 'unknown',
      1: 'has',
      2: 'shown',
      3: 'may_have',
      4: 'does_not_have'
    };

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      itemStates: { overall: {} },
      players: [],
      categories: [
      ]
    };
  }

  addCategory(category) {
    this.setState((prevState) => {
      category.items = category.items.map((item) => {
        return { id: this.itemCount++, name: item };
      });

      var itemStates = {};
      category.items.forEach((item) => {
        itemStates[item.id] = 0;
      });

      return update(prevState, {
        categories: { $push: [category] },
        itemStates: { overall: { $merge: itemStates } }
      });
    });
  }

  addPlayer(name) {
    this.setState((prevState) => {
      const id = prevState.players.length;
      const emptyItems = {};
      prevState.categories.forEach((category) => {
        category.items.forEach((item) => {
          emptyItems[item.id] = 0;
        });
      });

      return update(prevState, {
        itemStates: { $merge: { [id]: emptyItems } },
        players: { $push: [{ id: id, name: name }] }
      });
    });
  }

  componentDidMount() {
    this.addCategory({ id: 'chars', title: 'Characters', items: ['Green', 'Mustard', 'Peacock', 'Plum', 'Scarlet', 'White'] });
    this.addCategory({ id: 'weapons', title: 'Weapons', items: ['Wrench', 'Candlestick', 'Dagger', 'Pistol', 'Lead Pipe', 'Rope'] });
    this.addCategory({ id: 'locations', title: 'Locations', items: ['Bathroom', 'Office', 'Dining Room', 'Game Room', 'Garage', 'Bedroom', 'Living Room', 'Kitchen', 'Courtyard'] });

    this.addPlayer('Me')
    this.addPlayer('Mary')
    this.addPlayer('Mom')
  }

  handleClick(item, player) {
    const itemState = this.state.itemStates[player.id][item.id];

    var myState = this.state.itemStates[0][item.id];
    var isMyCard = myState === 1 || myState === 2;
    var newState = itemState === 4 ? 0 : itemState + 1;

    if (isMyCard && newState === 3) {
      newState = 0;
    } else if (!isMyCard && newState === 2) {
      newState = 3;
    }

    var overallState;
    if (newState === 1 || newState === 2) {
      overallState = 1;
    } else {
      overallState = 0;
    }

    this.setState((prevState) => {
      return update(prevState, {
        itemStates: {
          [player.id]: { [item.id]: { $set: newState } },
          overall: { $merge: { [item.id]: overallState } }
        }
      });
    });

    this.state.players.forEach((otherPlayer) => {
      if (otherPlayer.id === player.id) {
        return;
      }

      var setState;
      if (newState === 1 || newState === 2) {
        setState = -1;
      } else {
        setState = 0;
      }

      this.setState((prevState) => {
        return update(prevState, {
          itemStates: {
            [otherPlayer.id]: { [item.id]: { $set: setState } }
          }
        });
      });
    });
  }

  render() {
    return (
      <Table players={this.state.players} categories={this.state.categories} stateMap={this.stateMap} itemStates={this.state.itemStates} onClick={(item, player) => this.handleClick(item, player)} />
    )
  }
}

export default Game;
