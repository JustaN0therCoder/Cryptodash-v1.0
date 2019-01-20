import highChartsConfig from './HighCharts';
import React from 'react';
import {Tile} from '../Shared/Tile';
import {AppContext} from '../App/AppProvider';
import ReactHighCharts from 'react-highcharts';
import HighChartsTheme from './HighChartsTheme';

ReactHighCharts.Highcharts.setOptions(HighChartsTheme);

export default function() {
  return(
    <AppContext.Consumer>
    {({historical}) =>
      <Tile>
        {historical ? <ReactHighCharts config={highChartsConfig(historical)}/> : <div>Loading Historical Data</div>}
      </Tile>
    }
    </AppContext.Consumer>

  )
}
