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
      confirmFavorites: this.confirmFavorites,
      setCurrentFavorite: this.setCurrentFavorite,
    }
  }

  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
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
    let {favorites, currentFavorite} = cryptoDashData;
    return{favorites, currentFavorite};
  }

  confirmFavorites = () => {
    let currentFavorite = this.state.favorites[0];
    this.setState({
      firstVisit: false,
      page: 'dashboard', currentFavorite,
    }, () => {
      this.fetchPrices();
    });
    localStorage.setItem('cryptoDash', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
    }));
  }

  setCurrentFavorite = (sym) => {
    this.setState({
      currentFavorite: sym
    });
    localStorage.setItem('cryptoDash', JSON.stringify({
      ...JSON.parse(localStorage.getItem('cryptoDash')),
      currentFavorite: sym
    }))
  }

  fetchPrices = async () => {
    if(this.state.firstVisit) return;
    let prices = await this.prices();
    console.log(prices);
    this.setState({prices});
  }

  prices = async () => {
    let returnData = [];
    for (let i = 0; i < this.state.favorites.length; i++) {
      try {
        let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
        returnData.push(priceData);
      } catch (e) {
        console.warn('Fetch Price Error: ', e);
      }
    }
    return returnData;
  }

  setPage = page => this.setState({page})

  setFilteredCoins = (filteredCoins) => this.setState({filteredCoins})

  render() {
    return(
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
