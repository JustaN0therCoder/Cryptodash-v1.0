import React from 'react';
import styled, {css} from 'styled-components';
import {SelectableTile} from '../Shared/Tile';
import {fontSize3, fontSizeBig} from '../Shared/Styles';
import {CoinHeaderGrid} from '../Settings/CoinHeaderGrid';

const PriceTileStyled = styled(SelectableTile)`
  ${props => props.compact && css`
      ${fontSize3}
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 15px;
      justify-items: right;
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
        {numberFormat(data.CHANGEPCT24HOUR)}
      </ChangePct>
    </JustifyRight>
  );
}

function PriceTyleCompact({sym, data, compact}) {
  return(
    <PriceTileStyled compact>
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

function PriceTile({sym, data}) {
  return(
    <PriceTileStyled>
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
  let TileClass = index < 5 ? PriceTile : PriceTyleCompact;

    return (<TileClass sym={sym} data={data}>
        {sym}
        {data.PRICE}
      </TileClass>)
}
