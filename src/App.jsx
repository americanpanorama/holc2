import * as React from 'react';
import PropTypes from 'prop-types';

import { windowResized, loadInitialData } from './store/Actions';

// components (views)
import Masthead from './components/containers/Masthead';
import Search from './components/Search/containers/Search';
import VizCanvas from './components/containers/VizCanvas';
import DataViewer from './components/DataViewer/containers/DataViewer';
import DataViewerFull from './components/DataViewer/containers/DataViewerFull';
import LoadingNotification from './components/containers/LoadingNotification';
import Text from './components/Text/containers/Text';
import LandingView from './components/containers/LandingView';

import Store from './store';

export default class App extends React.Component {
  componentWillMount() {
    Store.dispatch(loadInitialData());
  }

  componentDidMount() {
    window.addEventListener('resize', windowResized);
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
        <LandingView />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  initialized: PropTypes.bool.isRequired,
  showMap: PropTypes.bool.isRequired,
};
