import * as React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';
import TypeAheadCitySnippet from './TypeAheadCitySnippet';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    const { options } = this.props;
    this.state = {
      options,
      allOptions: options,
    };

    this.typeahead = React.createRef();
    this.onOptionSelected = this.onOptionSelected.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onOptionSelected(e) {
    console.log(e);
    this.typeahead.current.setEntryText(null);
    this.typeahead.current.refs.entry.blur();
    this.props.selectCity(e.currentTarget.id);
  }

  onFocus() {
    const { allOptions: options } = this.state;
    this.setState({
      options,
    });
  }

  onBlur() {
    this.typeahead.current.setEntryText(null);
    // this.setState({
    //   options: [],
    // });
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
          // onFocus={this.onFocus}
          // onBlur={this.onBlur}
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
