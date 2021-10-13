import * as React from 'react';
import PropTypes from 'prop-types';

import { windowResized, loadInitialData, hashChanged } from './store/Actions';

// components (views)
import Masthead from './components/containers/Masthead';
import Search from './components/Search/containers/Search';
import VizCanvas from './components/containers/VizCanvas';
import DataViewer from './components/DataViewer/containers/DataViewer.js';
import DataViewerFull from './components/DataViewer/containers/DataViewerFull';
import LoadingNotification from './components/containers/LoadingNotification';
import Text from './components/Text/containers/Text';

import Store from './store';

export default class App extends React.Component {
  componentWillMount() {
    Store.dispatch(loadInitialData());
  }

  componentDidMount() {
    window.addEventListener('resize', windowResized);
    //window.addEventListener('hashchange', hashChanged);
    if (this.props.edition && this.props.edition === 'placesAndSpaces') {
      window.addEventListener('click', (e) => {
        const findParentByTagName = (element, tagName) => {
          let parent = element;
          while (parent !== null && parent.tagName !== tagName.toUpperCase()) {
            parent = parent.parentNode;
          }
          return parent;
        };
        if (findParentByTagName(e.target || e.srcElement, 'A')) {
          e.stopPropagation();
          e.preventDefault();
        }
      });
    }
  }

  render() {
    const { initialized, showMap } = this.props;
    return (
      <React.Fragment>
        <Masthead />
        {(initialized) && (
          <React.Fragment>
            {(showMap) ? (
              <React.Fragment>
                <Search />
                <VizCanvas />
                <DataViewer />
              </React.Fragment>
            ) : (
              <DataViewerFull />
            )}
          </React.Fragment>
        )}

        <LoadingNotification />
        {(!showMap) && (
          <Text />
        )}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  initialized: PropTypes.bool.isRequired,
  showMap: PropTypes.bool.isRequired,
};
