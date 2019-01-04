import React from 'react';
import PropTypes from 'prop-types';
import { AppActionTypes } from '../utils/AppActionCreator';
import CitySnippet from './City/CitySnippet.jsx';


export default class MapList extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div className='stateList'>
        <h2
          onClick={ this.props.onStateClick } 
          id={ this.props.stateAbbr }
        >
          { this.props.stateName }
        </h2>

        { this.props.cities.map((cityData) => {
          return <CitySnippet 
            cityData={ cityData } 
            onCityClick={ this.props.onCityClick } 
            key={ 'city' + cityData.ad_id } 
          />;
        }) }
      </div>
    );
  }
}

MapList.propTypes = {
  stateName: PropTypes.string,
  onCityClick: PropTypes.func
};
