import React from 'react';
import styled, {css} from 'styled-components';
import {SelectableTile} from '../Shared/Tile';
import {fontSize3, fontSizeBig, greenBoxShadow} from '../Shared/Styles';
import {CoinHeaderGrid} from '../Settings/CoinHeaderGrid';
import {AppContext} from '../App/AppProvider';

const PriceTileStyled = styled(SelectableTile)`
  ${props => props.compact && css`
      ${fontSize3}
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 15px;
      justify-items: right;
  `}
  ${props => props.currentFavorite && css`
    ${greenBoxShadow}
    pointer-events: none;
  `}
`

const JustifyRight =styled.div`
  justify-self: right;
`

const JustifyLeft =styled.div`
  justify-self: left;
`

const TickerPrice = styled.div`
  ${fontSizeBig}
`

const numberFormat = number => {
  return +(number + '').slice(0,7);
}

const ChangePct = styled.div`
  color: green;
  ${ props => props.red &&css`
    color:red;
  `}
`
function ChangePercent({data}) {
  return (
    <JustifyRight>
      <ChangePct red={data.CHANGEPCT24HOUR < 0}>
        {numberFormat(data.CHANGEPCT24HOUR)}%
      </ChangePct>
    </JustifyRight>
  );
}

function PriceTileCompact({sym, data, compact, currentFavorite, setCurrentFavorite}) {
  return(
    <PriceTileStyled onClick={setCurrentFavorite} compact currentFavorite={currentFavorite}>
      <JustifyLeft>{sym}</JustifyLeft>
      <ChangePercent data={data}/>
      <div>
        <TickerPrice>
          ${numberFormat(data.PRICE)}
        </TickerPrice>
      </div>
    </PriceTileStyled>
  )
}

function PriceTile({sym, data, currentFavorite, setCurrentFavorite}) {
  return(
    <PriceTileStyled onClick={setCurrentFavorite} currentFavorite={currentFavorite}>
      <CoinHeaderGrid>
        <div>{sym}</div>
        <ChangePercent data={data}/>
      </CoinHeaderGrid>
      <TickerPrice>
        ${numberFormat(data.PRICE)}
      </TickerPrice>
    </PriceTileStyled>
  );
}

export default function ({price, index}) {
  let sym = Object.keys(price)[0];
  let data = price[sym]['USD'];
  let TileClass = index < 5 ? PriceTile : PriceTileCompact;

    return (
      <AppContext.Consumer>
        {({currentFavorite, setCurrentFavorite}) =>
          <TileClass
            sym={sym}
            data={data}
            currentFavorite={currentFavorite === sym}
            setCurrentFavorite={() => setCurrentFavorite(sym)}
          >

          </TileClass>
        }
      </AppContext.Consumer>
  )
}
