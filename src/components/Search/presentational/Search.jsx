import * as React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';
import TypeAheadCitySnippet from './TypeAheadCitySnippet';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.typeahead = React.createRef();
    this.onOptionSelected = this.onOptionSelected.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onOptionSelected(e) {
    this.typeahead.current.setEntryText(null);
    this.typeahead.current.refs.entry.blur();
    this.props.selectCity(e.currentTarget.id);
  }

  onBlur() {
    // the delay gives onOptionSelected a moment to execute before the entry text is set to empty and the results disappear
    setTimeout(() => this.typeahead.current.setEntryText(null), 500);
  }

  render() {
    return (
      <div
        id="search"
      >
        <Typeahead
          options={this.props.options}
          placeholder="Search for city"
          filterOption="searchName"
          displayOption={city => city.ad_id}
          onOptionSelected={this.onOptionSelected}
          customListComponent={TypeAheadCitySnippet}
          onBlur={this.onBlur}
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
