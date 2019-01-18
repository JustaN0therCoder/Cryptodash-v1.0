import React from 'react';
import {Tile} from '../Shared/Tile';
import {AppContext} from '../App/AppProvider';
import CoinImage from '../Shared/CoinImage';
import styled from 'styled-components';

const SpoghtlightName = styled.h2`
  text-align: center;
`

export default function() {
  return (
    <AppContext.Consumer>
      {({currentFavorite, coinList}) =>
        <Tile>
          <SpoghtlightName>{coinList[currentFavorite].CoinName}</SpoghtlightName>
          <CoinImage spotlight coin={coinList[currentFavorite]}/>
        </Tile>
      }
    </AppContext.Consumer>
  )
}
