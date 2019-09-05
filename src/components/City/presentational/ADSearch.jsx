import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-typeahead';

import ADSearchSnippet from '../containers/ADSearchSnippet';

import TheStore from '../../../store';
import { adSearchingHOLCIds, searchingADsFor } from '../../../store/Actions';

export default class ADSearch extends React.Component {
  constructor() {
    super();

    this.adSearch = React.createRef();

    this.onSearchingADs = this.onSearchingADs.bind(this);
  }

  onSearchingADs() {
    TheStore.dispatch(searchingADsFor(this.adSearch.current.state.entryValue));
    const results = this.adSearch.current.state.searchResults.map(r => ({
      adId: r.adId,
      holcId: r.holcId,
    }));
    TheStore.dispatch(adSearchingHOLCIds(results));
  }

  render() {
    const { ADsForSearch, adId, selectArea } = this.props;

    // test to see if the user is searching and if there are no results
    const noResults = this.adSearch.current && this.adSearch.current.refs.entry.value
      && this.adSearch.current.refs.entry.value.length
      && this.adSearch.current.getOptionsForValue(this.adSearch.current.refs.entry.value, ADsForSearch).length === 0;

    return (
      <React.Fragment>
        <Typeahead
          options={ADsForSearch}
          placeholder="search"
          filterOption={(inputValue, option) => option.value.toLowerCase().includes(inputValue)}
          displayOption={adItem => `${adId}-${adItem.id}`}
          onOptionSelected={selectArea}
          customListComponent={ADSearchSnippet}
          ref={this.adSearch}
          onKeyUp={this.onSearchingADs}
          className="adsearchbox"
        />

        {(noResults) && (
          <h4>
            no search results
          </h4>
        )}
      </React.Fragment>
    );
  }
};

ADSearch.propTypes = {
  ADsForSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
  adId: PropTypes.number.isRequired,
  selectArea: PropTypes.func.isRequired,
};
