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
    const results = this.adSearch.current.state.searchResults.map(r => r.holcId);
    TheStore.dispatch(adSearchingHOLCIds(results));
  }

  render() {
    const { ADsForSearch, adId, selectArea } = this.props;
    return (
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
    );
  }
};

ADSearch.propTypes = {
  ADsForSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
  adId: PropTypes.number.isRequired,
  selectArea: PropTypes.func.isRequired,
};
