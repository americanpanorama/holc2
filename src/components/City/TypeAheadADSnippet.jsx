import React from 'react';
import CitySnippet from '../../City/presentational/CitySnippet';

export default class TypeAheadADSnippet extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='searchResults'>
        { this.props.options.map((cityData) => (
          <CitySnippet 
            cityData={cityData}
            onCityClick={this.props.onOptionSelected}
            displayState={true}
            key={`city${cityData.ad_id }`>
        ))}
      </div>
    );
  }
}
