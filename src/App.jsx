import * as React from 'react';
//import "babel-polyfill";
//import './utils/carto.js';

import { windowResized, selectCity, selectArea } from './store/Actions';

// components (views)
import Masthead from './components/containers/Masthead';
import Search from './components/Search/containers/Search';
import VizCanvas from './components/containers/VizCanvas';
import DataViewer from './components/DataViewer/containers/DataViewer';
import DataViewerFull from './components/DataViewer/containers/DataViewerFull';
import Text from './components/Text/containers/Text';

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
        const adId = Object.keys(cities)
          .map(id => cities[id])
          .find(c => c.slug === hashValues.city).ad_id;
        // load the area--it will also load the city
        if (hashValues.area) {
          Store.dispatch(selectArea(`${adId}-${hashValues.area}`));
        } else {
          Store.dispatch(selectCity(adId));
        }
      }
    }
    // //try to retrieve the users location
    // if (navigator.geolocation && !HashManager.getState().nogeo) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     AppActions.userLocated([position.coords.latitude, position.coords.longitude], this.state.selectedCity);
    //   }, (error) => {
    //     console.warn('Geolocation error occurred. Error code: ' + error.code);
    //   });
    // }

    // document.addEventListener('touchstart', (e) => {
    //   if (this.dragging) {
    //     e.preventDefault();
    //   }
    // });

    // document.addEventListener('touchmove', (e) => {
    //   if (this.dragging) {
    //     e.preventDefault();
    //   }
    // });
  }

  componentDidMount() {
    window.addEventListener('resize', windowResized);
  }

  render() {
    return (
      <div className="container">
        <Masthead />
        <Search />
        <VizCanvas />
        <DataViewer />
        <DataViewerFull />
        <Text />
      </div>
    );
  }
}
