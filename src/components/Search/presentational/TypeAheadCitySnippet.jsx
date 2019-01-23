import React from 'react';
import CitySnippet from '../../City/CitySnippet';

export default class TypeAheadCitySnippet extends React.Component {
  render() {
    return (
      <div className='searchResults'>
        {this.props.options.map((cityData) => (
          <CitySnippet
            cityData={ cityData }
            onCityClick={this.props.onOptionSelected}
            displayState={ true }
            key={`city-${cityData.ad_id}`}
          />
        ))}
      </div>
    );
  }
}
