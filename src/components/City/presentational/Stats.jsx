import React from 'react';

import Population from '../containers/Population';
import Downloader from '../containers/Downloader';
import CityViz from '../containers/CityViz';
import ADSelections from '../containers/ADSelections';

const Stats = () => (
  <div className="cityStats">
    <CityViz />
    <Population />
    <ADSelections />
  </div>
);

export default Stats;
