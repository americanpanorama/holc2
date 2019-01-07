import React from 'react';
import PropTypes from 'prop-types';

import Sidebar from '../Sidebar';
import Header from './Header';
import Population from './Population';
import Downloader from './Downloader';
import CityViz from './CityViz';
import BurgessViz from './BurgessViz';
import ADSearch from './ADSearch';

const Stats = (props) => (
  <Sidebar 
    className='cityStats'
    style={props.style}
  >
    <Header {...props} />

    { (props.hasADData || props.hasADImages) ?
      <div className='adInstructions'>click on neighborhoods to read their area descriptions</div> :
      <div className='adInstructions'>area descriptions aren't available for this city, but will be soon</div>
    }

    { (props.hasADData) &&
      <ADSearch {...props} />
    }

    { (props.popStats && props.popStats[1930].total && props.popStats[1940].total) &&
      <Population stats={props.popStats} />
    }

    <CityViz 
      width={props.style.width}
      {...props}
    />

    <BurgessViz 
      width={props.style.width * 2 / 3}
      areaSelected={props.areaSelected}
      areaUnselected={props.areaUnselected}
      ringStats={props.ringStats}
      selectedGrade={props.selectedGrade}
    />

    <Downloader {...props} />
  </Sidebar>
);

export default Stats;

// property validation
Stats.propTypes = {
  ringStats: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  gradeStats: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  areaSelected: PropTypes.func,
  areaUnselected: PropTypes.func,
  gradeSelected: PropTypes.func,
  gradeUnselected: PropTypes.func,
  style: PropTypes.shape({

  }).isRequired,
};

// (instead of ES5-style getDefaultProps)
Stats.defaultProps = {
  name: '',
  ringStats: {
    1: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      density: 0,
    },
    2: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      density: 0,
    },
    3: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      density: 0,
    },
    4: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      density: 0,
    },
  },
  gradeStats: {
    A: {
      area: 0,
      percent: 0
    },
    B: {
      area: 0,
      percent: 0
    },
    C: {
      area: 0,
      percent: 0
    },
    D: {
      area: 0,
      percent: 0
    },
  },
};
