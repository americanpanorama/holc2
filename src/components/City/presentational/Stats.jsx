import React from 'react';

import Population from '../containers/Population';
import Downloader from '../containers/Downloader';
import CityViz from '../containers/CityViz';
import BurgessViz from '../containers/BurgessViz';
import ADSelections from '../containers/ADSelections';

const Stats = () => (
  <div className="cityStats">
    <Population />
    <ADSelections />
    <CityViz />
    <Downloader />
  </div>
);

export default Stats;
