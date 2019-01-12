import React from 'react';
import {AppContext} from '../App/AppProvider';
import {SelectableTile, DisabledTile, DeletableTile} from '../Shared/Tile';
import CoinHeaderGrid from './CoinHeaderGrid';
import CoinImage from '../Shared/CoinImage';


function clickCoinHandler(topSection, coinKey, addCoin, removeCoin) {
  return topSection ? () => {
    removeCoin(coinKey)
  }: () => {
      addCoin(coinKey)
  }
}

export default function({coinKey, topSection}){

  return(
    <AppContext.Consumer>
      {({coinList, addCoin, removeCoin, isInFavorites}) =>{
        let coin = coinList[coinKey];
        let TitleClass = SelectableTile;
        if(topSection){
          TitleClass = DeletableTile;
        } else if (isInFavorites(coinKey)) {
          TitleClass = DisabledTile;
        }

        return (
          <TitleClass
            onClick={clickCoinHandler(topSection, coinKey, addCoin, removeCoin)}
          >
        <CoinHeaderGrid topSection = {topSection} name={coin.CoinName} symbol={coin.Symbol}/>
        <CoinImage coin={coin}/>
        </TitleClass>)
      }}
    </AppContext.Consumer>
  )
}
