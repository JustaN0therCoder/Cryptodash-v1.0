import React from 'react';
import {AppContext} from '../App/AppProvider';
import {SelectableTile, DisabledTile, DeletableTile} from '../Shared/Tile';
import CoinHeaderGrid from './CoinHeaderGrid';
import CoinImage from '../Shared/CoinImage';


export default function({coinKey, topSection}){

  return(
    <AppContext.Consumer>
      {({coinList}) =>{
        let coin = coinList[coinKey];
        let TitleClass = SelectableTile;
        if(topSection){
          TitleClass = DeletableTile;
        }

        return <TitleClass>
        <CoinHeaderGrid topSection = {topSection} name={coin.CoinName} symbol={coin.Symbol}/>
        <CoinImage coin={coin}/>
        </TitleClass>
      }}
    </AppContext.Consumer>
  )
}
