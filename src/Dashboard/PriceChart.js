import highChartsConfig from './HighCharts';
import React from 'react';
import {Tile} from '../Shared/Tile';
import {AppContext} from '../App/AppProvider';
import ReactHighCharts from 'react-highcharts';

export default function() {
  return(
    <AppContext.Consumer>
    {({}) =>
      <Tile>
        <ReactHighCharts config={highChartsConfig()}/>
      </Tile>
    }
    </AppContext.Consumer>

  )
}
