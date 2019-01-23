import React from 'react';

import Population from '../containers/Population';
import Downloader from '../containers/Downloader';
import CityViz from '../containers/CityViz';
import BurgessViz from '../containers/BurgessViz';
//import ADSearch from '../ADSearch';

const Stats = () => (
  <div className="cityStats">
    {/* JSX Comment
    { (props.hasADData || props.hasADImages) ?
      <div className='adInstructions'>click on neighborhoods to read their area descriptions</div> :
      <div className='adInstructions'>area descriptions aren't available for this city, but will be soon</div>
    } 

    { (props.hasADData) &&
      <ADSearch {...props} />
    }

    */}

    <Population />
    <CityViz />
    <BurgessViz />
    <Downloader />
  </div>
);

export default Stats;
