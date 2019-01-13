import React from 'react';
import _ from 'lodash';

const cc = require('cryptocompare');

const MAX_FAVORITES = 10;

export const AppContext = React.createContext();

export class AppProvider extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      page: 'dashboard',
      favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
      ...this.savedSettings(),
      addCoin: this.addCoin,
      removeCoin: this.removeCoin,
      setPage: this.setPage,
      isInFavorites: this.isInFavorites,
      setFilteredCoins: this.setFilteredCoins,
      confirmFavorites: this.confirmFavorites
    }
  }

  componentDidMount = () => {
    this.fetchCoins();
  }

  addCoin = key =>{
    let favorites = [...this.state.favorites];

    if (favorites.length < MAX_FAVORITES) {
      favorites.push(key);
      this.setState({favorites});
    }
  }

  removeCoin = key => {
    let favorites = [...this.state.favorites];
    this.setState({favorites: _.pull(favorites, key)})
  }

  isInFavorites = key => _.includes(this.state.favorites, key);

  fetchCoins = async () =>{
    let coinList = (await cc.coinList()).Data;
    this.setState({coinList});
  }

  savedSettings(){
    let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
    if (!cryptoDashData) {
      return{page: 'settings', firstVisit: true}
    }
    let {favorites} = cryptoDashData;
    return{favorites};
  }

  confirmFavorites = () => {
    this.setState({
      firstVisit: false,
      page: 'dashboard'
    });
    localStorage.setItem('cryptoDash', JSON.stringify({
      favorites: this.state.favorites
    }));
  }

  setPage = page => this.setState({page})

  setFilteredCoins = (filtredCoins) => this.setState({filtredCoins})

  render() {
    return(
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
