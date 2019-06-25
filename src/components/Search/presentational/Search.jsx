import * as React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';
import TypeAheadCitySnippet from './TypeAheadCitySnippet';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.typeahead = React.createRef();
    this.onOptionSelected = this.onOptionSelected.bind(this);
  }

  onOptionSelected(e) {
    this.typeahead.current.setEntryText(null);
    this.typeahead.current.refs.entry.blur();
    this.props.selectCity(e.currentTarget.id);
  }

  render() {
    const { options } = this.props;
    return (
      <div
        id="search"
      >
        <Typeahead
          options={options}
          placeholder="Search for city"
          filterOption="searchName"
          value=""
          displayOption={city => city.ad_id}
          onOptionSelected={this.onOptionSelected}
          customListComponent={TypeAheadCitySnippet}
          onBlur={this.onBlur}
          maxVisible={8}
          ref={this.typeahead}
        />
      </div>
    );
  }
}

Search.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectCity: PropTypes.func.isRequired,
  citySearchStyle: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
};
