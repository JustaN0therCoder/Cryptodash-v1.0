import React from 'react';
import _ from 'lodash';
import moment from 'moment';

const cc = require('cryptocompare');

const MAX_FAVORITES = 10;
const TIME_UNITS = 10;
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
      timeInterval: 'months',
      isInFavorites: this.isInFavorites,
      setFilteredCoins: this.setFilteredCoins,
      confirmFavorites: this.confirmFavorites,
      setCurrentFavorite: this.setCurrentFavorite,
      changeChartSelect: this.changeChartSelect,
    }
  }

  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
    this.fetchHistorical();
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

  fetchHistorical = async () => {
    if (this.state.firstVisit) return;
    let results = await this.historical();
    let historical = [
      {
        name: this.state.currentFavorite,
        data: results.map((ticker, index) => [
          moment().subtract({[this.state.timeInterval]: TIME_UNITS - index}).valueOf(),
          ticker.USD
        ]),
      }
    ]
    this.setState({historical});
  }

  historical = () =>{
    let promises = [];
    for (let units = TIME_UNITS; units > 0; units--){
      promises.push(
        cc.priceHistorical(
          this.state.currentFavorite,
          ['USD'],
          moment()
          .subtract({[this.state.timeInterval]: units})
          .toDate()
        )
      )
    }
    return Promise.all(promises);
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
      page: 'dashboard',
      currentFavorite,
      prices: null,
      historical: null,
    }, () => {
      this.fetchPrices();
      this.fetchHistorical();
    });
    localStorage.setItem('cryptoDash', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
    }));
  }

  setCurrentFavorite = (sym) => {
    this.setState({
      currentFavorite: sym,
      historical: null,
    }, this.fetchHistorical);
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

changeChartSelect = (value) => {
  this.setState({timeInterval: value, historical: null}, this.fetchHistorical);

}


  render() {
    return(
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
