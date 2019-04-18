import * as React from 'react';

import { windowResized, selectCity, selectArea, selectCategory, userLocated, geolocating } from './store/Actions';

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
    const { hash } = window.location;
    const hashValues = {};
    hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      hashValues[key] = value;
    });
    if (hashValues.city || (hashValues.city && hashValues.area)) {
      const { cities } = Store.getState();
      if (cities) {
        const adId = cities.find(c => c.slug === hashValues.city).ad_id;
        let loc;
        if (hashValues.loc) {
          const coords = hashValues.loc.split('/');
          loc = {
            zoom: coords[0],
            lat: coords[1],
            lng: coords[2],
          };
        }
        // load the area--it will also load the city
        if (hashValues.area) {
          Store.dispatch(selectArea(`${adId}-${hashValues.area}`));
        } else {
          Store.dispatch(selectCity(adId, loc));
        }

        if (hashValues.category) {
          Store.dispatch(selectCategory(hashValues.category));
        }
      }
    }

    // try to retrieve the users location
    if (!hashValues.nogeo && navigator.geolocation) {
      Store.dispatch(geolocating());
      navigator.geolocation.getCurrentPosition((position) => {
        Store.dispatch(userLocated([position.coords.latitude, position.coords.longitude], !hashValues.city, !hashValues.loc));
      }, (error) => {
        console.warn(`Geolocation error occurred. Error code: ${error.code}`);
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', windowResized);
  }

  render() {
    return (
      <React.Fragment>
        <Masthead />
        <Search />
        <VizCanvas />
        <DataViewer />
        <DataViewerFull />
        <LoadingNotification />
        <Text />
        <LandingView />
      </React.Fragment>
    );
  }
}
