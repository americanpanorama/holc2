import * as React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';
import TypeAheadCitySnippet from './TypeAheadCitySnippet';

const Search = ({ options, selectCity, citySearchStyle })=> (
  <div className="city-selector" style={citySearchStyle}>
    <Typeahead
      options={options}
      placeholder="Search by city or state"
      filterOption="searchName"
      displayOption={city => city.ad_id}
      onOptionSelected={selectCity}
      customListComponent={TypeAheadCitySnippet}
      maxVisible={8}
    />
  </div>
);

Search.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectCity: PropTypes.func.isRequired,
  citySearchStyle: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
};

export default Search;
