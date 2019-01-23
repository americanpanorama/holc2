import * as React from 'react';
import { Provider } from 'react-redux';
//import "babel-polyfill";
//import './utils/carto.js';
import { Map, TileLayer } from 'react-leaflet';
import { Typeahead } from 'react-typeahead';

import TheStore from './store';
import { citySelected, updateMap } from './store/Actions';

// stores
import AreaDescriptionsStore from './stores/AreaDescriptionsStore';
import CitiesStore from './stores/CitiesStore';
import CityStore from './stores/CityStore';
import DimensionsStore from './stores/DimensionsStore';
import MapStateStore from './stores/MapStateStore';
import RasterStore from './stores/RasterStore';
import UserLocationStore from './stores/UserLocationStore';
import TextsStore from './stores/TextsStore';
import HashManager from './stores/HashManager';

// components (views)
import HOLCMap from './components/HOLCMap/containers/HOLCMap';
import Sidebar from './components/Sidebar/containers/Sidebar';
import ADCat from './components/ADCat';
import SelectedNeighborhood from './components/SelectedNeighborhood';
import Burgess from './components/Burgess';
import CitySnippet from './components/City/CitySnippet';
import CityStatsButton from './components/CityStatsButton';
import ContactUs from './components/ContactUs';
import Masthead from './components/Masthead';
import StateList from './components/StateList';
import Search from './components/Search/containers/Search';

import SidebarMap from './components/SidebarMap';
import IntroModal from './components/IntroModal';


// utils
import { AppActions, AppActionTypes } from './utils/AppActionCreator';

// data
import panoramaNavData from '../data/panorama_nav.json';
import stateAbbrs from '../data/state_abbr.json';


export default class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = this.getDefaultState();

    // bind handlers
    const handlers = ['changeHash', 'downloadGeojson', 'getLeafletElementForMap', 'onAdImageClicked', 'onAreaChartHover', 'onAreaChartOff', 'onBringToFrontClick', 'onBurgessChartHover', 'onBurgessChartOff', 'onCategoryClick', 'onCategoryClose', 'onCityMarkerSelected', 'onCitySelected', 'onContactUsToggle', 'onCountrySelected', 'onDownloadClicked', 'onGradeHover', 'onGradeUnhover', 'onHOLCIDClick', 'onMapMoved', 'onModalClick', 'onNeighborhoodClose', 'onNeighborhoodHighlighted', 'onNeighborhoodPolygonClick', 'onNeighborhoodUnhighlighted', 'onPanoramaMenuClick', 'onSliderChange', 'onStateSelected', 'onToggleADView', 'onUserCityResponse', 'onWindowResize', 'storeChanged','onMapClick','onDismissIntroModal','onNeighborhoodClick','onSearchingADs', 'onMobileHandleDown', 'onMobileHandleDrag', 'onMobileHandleUp', 'toggleHOLCMap', 'toggleCityStats'];
    handlers.map(handler => { this[handler] = this[handler].bind(this); });
  }

  /* Lifecycle methods */

  componentWillMount () {
    AppActions.loadInitialData(this.state, HashManager.getState());

    //try to retrieve the users location
    if (navigator.geolocation && !HashManager.getState().nogeo) {
      navigator.geolocation.getCurrentPosition((position) => {
        AppActions.userLocated([position.coords.latitude, position.coords.longitude], this.state.selectedCity);
      }, (error) => {
        console.warn('Geolocation error occurred. Error code: ' + error.code);
      });
    }

    document.addEventListener('touchstart', (e) => {
      if (this.dragging) {
        e.preventDefault();
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (this.dragging) {
        e.preventDefault();
      }
    });
  }

  componentDidMount () {
    window.addEventListener('resize', this.onWindowResize);
    AreaDescriptionsStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    CitiesStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    CityStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    DimensionsStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    MapStateStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    RasterStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    UserLocationStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
    TextsStore.addListener(AppActionTypes.storeChanged, this.storeChanged);

    //AppActions.mapInitialized(this.getLeafletElementForMap(), this.props.initialHashState);

    // // you have to wait until there's a map to query to get and initialize the visible maps
    // const waitingId = setInterval(() => {
    //   if (RasterStore.hasLoaded() && AreaDescriptionsStore.hasLoaded()) {
    //     clearInterval(waitingId);
    //     AppActions.mapInitialized(this.getLeafletElementForMap(), this.props.requestedZoom);
    //   }
    // }, 10);
  }

  /* state methods */

  getDefaultState () {
    const hashState = HashManager.getState();

    return {
      adImageOpen: (hashState.adimage),
      contactUs: false,
      downloadOpen: false,
      highlightedNeighborhood: null,
      map: {
        zoom: (hashState.loc && hashState.loc.zoom) ? hashState.loc.zoom : 5,
        center: (hashState.loc && hashState.loc.center) ? hashState.loc.center : [39.1045,-94.5832] 
      },
      showIntroModal: window.localStorage.getItem('hasViewedIntroModal-redlining') !== 'true',
      showCityStats: true,
      rasterOpacity: (hashState.opacity) ? parseFloat(hashState.opacity) : 1,
      searchingADs: false,
      searchingADsAreas: [],
      selectedCategory: (hashState.category) ? hashState.category : null,
      selectedCity: null, 
      selectedGrade: null,
      selectedNeighborhood: (hashState.area) ? hashState.area : null,
      selectedRingGrade: { 
        ringId: null, 
        grade: null
      },
      text: (hashState.text) ? hashState.text : null,
      unselectedVisibleCities: []
    };
  }

  storeChanged (options = {}) {
    this.setState({
      adImageOpen: ((!CityStore.getSelectedHolcId() || !CityStore.getId()) && CityStore.hasLoaded() && MapStateStore.hasLoaded()) ? false : this.state.adImageOpen,
      highlightedNeighborhood: CityStore.getHighlightedHolcId(),
      map: {
        center: MapStateStore.getCenter(),
        zoom: MapStateStore.getZoom()
      },
      selectedCategory: CityStore.getSelectedCategory(),
      selectedCity: CityStore.getId(),
      selectedGrade: CityStore.getSelectedGrade(),
      selectedNeighborhood: CityStore.getSelectedHolcId(),
      selectedRingGrade: CityStore.getSelectedRingGrade(),
      text: TextsStore.getSubject(),
      unselectedVisibleCities: MapStateStore.getVisibleAdIds().map(adId => CitiesStore.getFullCityMetadata(adId)).filter(cityMetadata => (cityMetadata.ad_id !== CityStore.getId()))
    }); 
  }

  /* action handler functions */

  onAdImageClicked () {
    AppActions.ADImageOpened(this.state.selectedNeighborhood, this.state.selectedCity);
    this.setState({
      adImageOpen: !this.state.adImageOpen
    });
  }

  onAreaChartHover (event) { AppActions.gradeSelected(event.currentTarget.id); }

  onAreaChartOff () { AppActions.gradeSelected(null); }

  onBringToFrontClick (event) {
    AppActions.mapClicked();
  }

  onBurgessChartHover (event) {
    const [ringId, grade] = event.currentTarget.id.split('-');
    console.log(ringId, grade);
    AppActions.ringGradeSelected({ringId: parseInt(ringId), grade: grade}); 
  }

  onBurgessChartOff () { AppActions.ringGradeSelected({ringId: -1, grade: null}); }

  onCategoryClick (event) {
    this.closeADImage();
    AppActions.ADCategorySelected(event.target.id);
  }

  onCategoryClose (event) {AppActions.ADCategorySelected(null); }

  onCityMarkerSelected(event) {
    const cityId = parseInt(event.target.options.id, 10);
    citySelected(cityId);

    this.closeADImage();
    AppActions.citySelected(event.target.options.id, true);
  }

  onCitySelected (event) {
    event.preventDefault(); /* important as this is sometimes used in an a href there only for indexing */
    this.closeADImage();
    AppActions.onModalClick(null);

    AppActions.citySelected(parseInt(event.target.id, 10), true);



    this.setState({ 
      searchingADs: false,
      searchingADsAreas: []
    });
  }

  onContactUsToggle () {
    this.setState({
      contactUs: !this.state.contactUs
    });
    AppActions.onModalClick(null);
  }

  onCountrySelected () { AppActions.countrySelected(); }

  onDownloadClicked () {
    this.setState({
      downloadOpen: !this.state.downloadOpen
    });
  }

  onGradeHover (event) { AppActions.gradeSelected(event.target.grade); }

  onGradeUnhover () { AppActions.gradeSelected(null); }

  onHOLCIDClick (event) { AppActions.neighborhoodSelected(event.currentTarget.id, this.state.selectedCity); }

  onMapClick (event) { 
    this.refs.holc_map.refs['holctiles' + event.target.options.id].leafletElement.bringToFront();
    AppActions.mapClicked(event.target.options.id); 
  }

  onMapMoved() {
    // wait a second to update 
    setTimeout(() => {
      const theMap = this.getLeafletElementForMap();
      const zoom = theMap.getZoom();
      const center = [theMap.getCenter().lat, theMap.getCenter().lng];
      const bounds = theMap.getBounds();
      TheStore.dispatch(updateMap({
        zoom,
        center,
        bounds,
      }));
    }, 1000);

    AppActions.mapMoved(this.getLeafletElementForMap());
  }

  onModalClick (event) {
    const subject = (event.target.id) ? (event.target.id) : null;
    AppActions.onModalClick(subject);
    this.setState({
      contactUs: null
    });
  }

  onNeighborhoodClose() { AppActions.neighborhoodSelected(null, this.state.selectedCity); }

  onNeighborhoodHighlighted (event) {
    AppActions.neighborhoodHighlighted(event.target.id);
    this.bringMapForNeighborhoodToFront(this.selectedCity, event.target.id);
  }

  onNeighborhoodUnhighlighted () {
    AppActions.neighborhoodHighlighted(null);
  }

  onNeighborhoodClick (event) {
    const neighborhoodId = event.target.id,
      adId = this.state.selectedCity;
    console.log(neighborhoodId, adId);
    AppActions.neighborhoodSelected(neighborhoodId, adId);
    this.bringMapForNeighborhoodToFront(adId, neighborhoodId);
  }

  onNeighborhoodPolygonClick (event) {
    console.log(event);
    let neighborhoodId = event.target.options.neighborhoodId,
      adId = parseInt(event.target.options.adId);

    // clicking on a selected neighborhood deselects it and closes the adImage if it's open
    if (neighborhoodId == this.state.selectedNeighborhood && adId == this.state.selectedCity) {
      neighborhoodId = null;
      this.closeADImage();
    } 
    AppActions.neighborhoodSelected(neighborhoodId, adId);

    this.bringMapForNeighborhoodToFront(adId, neighborhoodId);
  }

  onPanoramaMenuClick () {
    this.setState({
      show_panorama_menu: !this.state.show_panorama_menu
    });
  }

  onSliderChange (value) {
    this.setState({
      rasterOpacity: value / 100
    });
  }

  toggleHOLCMap () {
    this.setState({
      rasterOpacity: (this.state.rasterOpacity > 0) ? 0 : 1
    });
  }

  onSearchingADs(e) {
    this.setState({ 
      searchingADs: true,
      searchingADsAreas: this.refs.citystats.refs.adsearch.refs.adSearch.getOptionsForValue(this.refs.citystats.refs.adsearch.refs.adSearch.refs.entry.value, AreaDescriptionsStore.getADsForSearch(this.state.selectedCity)).map(a => a.holcId)
    });
  }

  onStateSelected (value, index) {
    // for click on state name in sidebar
    value = (value.target) ? value.target : value;
    const abbr = value.id;
    AppActions.stateSelected(abbr);
  }

  onToggleADView () {
    AppActions.toggleADView();
  }

  onUserCityResponse(event) {
    if (event.target.value == 'yes') {
      AppActions.citySelected(UserLocationStore.getAdId(), true);
    }
    AppActions.userRespondedToZoomOffer();
  }

  onWindowResize (event) { AppActions.windowResized(); }

  closeADImage() {
    this.setState({
      adImageOpen: false
    });
  }

  bringMapForNeighborhoodToFront(adId, neighborhoodId) {
    const mapIds = AreaDescriptionsStore.getNeighborhoodMapIds(adId, neighborhoodId),
      sortOrder = MapStateStore.getSortOrder();

    // check to see if the top maps match the applicable ones; do if they don't bring them to the top
    if (mapIds.length > 0 && neighborhoodId !== null && JSON.stringify(mapIds.concat().sort()) !== JSON.stringify(sortOrder.slice(0, mapIds.length).sort())) {
      // if there's only one map, bring it to the front if it isn't already
      mapIds.reverse().forEach(mapId => {
        this.refs.holc_map.refs['holctiles' + mapId].leafletElement.bringToFront();
        AppActions.mapClicked(mapId);
      });
    }
  }

  onDismissIntroModal (persist) {
    if (persist) {
      window.localStorage.setItem('hasViewedIntroModal-redlining', 'true');
    }
    this.setState({
      showIntroModal: false
    });
  }

  onMobileHandleDown (e) {
    this.dragging = true;
    this.yCoord = e.changedTouches[0].pageY;
  }

  onMobileHandleDrag (e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.dragging && e.changedTouches) {
      const yDiff = this.yCoord - e.changedTouches[e.changedTouches.length - 1].pageY;
      this.yCoord = e.changedTouches[e.changedTouches.length - 1].pageY;
      const newHeight = DimensionsStore.getDimensions().mobileSidebarHeight + yDiff;
      AppActions.mobileSidebarResized(newHeight);
    }
  }

  onMobileHandleUp () {
    this.dragging = false;
    this.yCoord = null;
  }

  toggleCityStats () {
    this.setState({
      showCityStats: !this.state.showCityStats
    });
  }


  /* manage hash */

  changeHash () {
    const {
      map
    } = TheStore.getState();

    HashManager.updateHash({ 
      adimage: (this.state.adImageOpen) ? this.formatADHashState() : null,
      area: this.state.selectedNeighborhood,
      category: this.state.selectedCategory,
      city: CityStore.getSlug(),
      loc: map,
      opacity: this.state.rasterOpacity,
      text: this.state.text,
      sort: (MapStateStore.getSortOrder().length > 0) ? MapStateStore.getSortOrder() : null,
      adview: (AreaDescriptionsStore.show() == 'full') ? 'full' : null
    });
  }

  formatADHashState () {
    if (!this.state.adImageOpen) {
      return null;
    }

    const adLE = this.getLeafletElementForAD();
    if (adLE) {
      const zoom = adLE.getZoom(),
        center = adLE.getCenter(),
        x = Math.round(center.lng),
        y = Math.round(center.lat);

      return zoom + '/' + y + '/' + x;
    }
    return null;

  }

  getADZoom() {
    const hashState = HashManager.getState();
    return (hashState.adimage) ? parseInt(hashState.adimage.split('/')[0]) : 3;
  }

  getADX() {
    const hashState = HashManager.getState();
    return (hashState.adimage) ? parseInt(hashState.adimage.split('/')[2]) : -125;
  }

  getADY() {
    const hashState = HashManager.getState();
    return (hashState.adimage) ? parseInt(hashState.adimage.split('/')[1]) : 75;
  }

  getADMaxBounds() {
    const sheets = AreaDescriptionsStore.getSheets(this.state.selectedCity, this.state.selectedNeighborhood);
    switch (sheets) {
    case 1:
      return [[-10,-180],[90,-60]];
    case 2:
      return [[-10,-180],[90,70]];
    }
  }

  getCatLetter() { return (this.state.selectedCategory) ? this.state.selectedCategory.split('-')[1] : null; }

  getCatNum() { return (this.state.selectedCategory) ? this.state.selectedCategory.split('-')[0] : null; }

  getLeafletElementForAD() { return (this.refs.the_ad_tiles) ? this.refs.the_ad_tiles.leafletElement : null; }

  getLeafletElementForMap() {
    if (this.refs.sidebar_map) {
      return this.refs.sidebar_map.refs.holc_map.refs.the_map.leafletElement;
    }
    if (this.refs.holc_map) {
      return this.refs.holc_map.refs.the_map.leafletElement;
    } 
    
    return false;
  }

  downloadGeojson () {
    let geojson = AreaDescriptionsStore.getADsAsGeojson(this.state.selectedCity),
      blob = new Blob([JSON.stringify(geojson)]),
      geojsonURL = window.URL.createObjectURL(blob),
      tempLink = document.createElement('a');
    tempLink.href = geojsonURL;
    tempLink.setAttribute('download', 'areadescription.geojson');
    tempLink.click();
  }

  render () {
    const dimensions = DimensionsStore.getDimensions();

    const { cities, selectedCity } = TheStore.getState();

    return (
      <div className={`container full-height ${dimensions.size}`}>
        <Masthead
          style={dimensions.headerStyle}
          onModalClick={this.onModalClick}
          onContactUsToggle={this.onContactUsToggle}
        />

        <Search />
        <HOLCMap />
        <Sidebar />

        { (false) &&
          <React.Fragment>
            { (this.state.selectedCity && this.state.selectedNeighborhood) &&
              <SelectedNeighborhood
                adImageOpen={this.state.adImageOpen}
                areaId={this.state.selectedNeighborhood} 
                previousAreaId={ AreaDescriptionsStore.getPreviousHOLCId(this.state.selectedCity, this.state.selectedNeighborhood) }
                nextAreaId={ AreaDescriptionsStore.getNextHOLCId(this.state.selectedCity, this.state.selectedNeighborhood) }
                neighborhoodNames={ AreaDescriptionsStore.getNeighborhoodNames(this.state.selectedCity) }
                areaDescriptions={ AreaDescriptionsStore.getADsForNeighborhood(this.state.selectedCity, this.state.selectedNeighborhood) }
                thumbnailUrl={ AreaDescriptionsStore.getThumbnailUrl(this.state.selectedCity, this.state.selectedNeighborhood) }
                sheets={ AreaDescriptionsStore.getSheets(this.state.selectedCity, this.state.selectedNeighborhood) }
                formId={ CityStore.getFormId() } 
                city={CityStore.getName()}
                state={CityStore.getState()}
                cityId={ this.state.selectedCity }
                citySlug={ CityStore.getSlug() }
                hasADData={cities[this.state.selectedCity].hasADs}
                hasADImages={cities[this.state.selectedCity].hasImages}
                onCategoryClick={ this.onCategoryClick } 
                onHOLCIDClick={ this.onHOLCIDClick } 
                onAdImageClicked={ this.onAdImageClicked }
                onToggleADView={ this.onToggleADView }
                onClose={ this.onNeighborhoodClose }
                ref={'areadescription' + this.state.selectedNeighborhood } 
                previousStyle={ DimensionsStore.getADNavPreviousStyle() }
                nextStyle={ DimensionsStore.getADNavNextStyle() }
                show={ AreaDescriptionsStore.show() }
                style={DimensionsStore.getSidebarStyle()}
                headerStyle={dimensions.selectedNeighborhoodHeaderStyle}
                ADTranscriptionStyle={dimensions.ADTranscriptionStyle}
                ADImageStyle={dimensions.ADImageStyle}
                center={[this.getADY(),this.getADX()]}
                zoom={this.getADZoom()}
                maxBounds={this.getADMaxBounds()}
                ADTileUrl={AreaDescriptionsStore.getAdTileUrl(this.state.selectedCity, this.state.selectedNeighborhood)}
                onMoveend={this.changeHash}
              />
            }

            { (!this.state.selectedNeighborhood && !this.state.selectedCategory && this.state.selectedCity && !this.state.showCityStats) &&
              <CityStatsButton
                name={ CityStore.getName() }
                state={ CityStore.getState() }
                toggleCityStats={this.toggleCityStats}
                style={dimensions.cityStatsButtonStyle}
              />
            }

            { (this.state.selectedCategory) &&
              <ADCat 
                ADsByCat={ AreaDescriptionsStore.getADsForCategory(this.state.selectedCity, this.state.selectedCategory) }
                neighborhoodNames={ AreaDescriptionsStore.getNeighborhoodNames(this.state.selectedCity) }
                formId = { AreaDescriptionsStore.getFormId(this.state.selectedCity) }
                title={ AreaDescriptionsStore.getCatTitle(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                catNum={ this.getCatNum() } 
                catLetter = { this.getCatLetter() } 
                previousCatIds = { AreaDescriptionsStore.getPreviousCatIds(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                nextCatIds = { AreaDescriptionsStore.getNextCatIds(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                cityId={ this.state.selectedCity }
                onNeighborhoodClick={ this.onHOLCIDClick } 
                onCategoryClick={ this.onCategoryClick } 
                onNeighborhoodHover={ this.onNeighborhoodHighlighted } 
                onNeighborhoodOut={ this.onNeighborhoodUnhighlighted } 
                previousStyle={ DimensionsStore.getADNavPreviousStyle() }
                nextStyle={ DimensionsStore.getADNavNextStyle() }
                onClose={ this.onCategoryClose }
                style={DimensionsStore.getSidebarStyle()}
              />
            }


            { (false && this.state.selectedNeighborhood && this.state.adImageOpen) &&
              (AreaDescriptionsStore.getSheets(this.state.selectedCity, this.state.selectedNeighborhood)) ?
                <Map 
                  ref='the_ad_tiles' 
                  center={ [this.getADY(),this.getADX()] } 
                  zoom={ this.getADZoom() }
                  minZoom={ 3 }
                  maxZoom={ 5 }
                  maxBounds={ this.getADMaxBounds() }
                  className='sidebar'
                  style={DimensionsStore.getSidebarStyle()}
                  onMoveend={ this.changeHash }
                >
                  { (cities[this.state.selectedCity].hasADs && AreaDescriptionsStore.getAdTileUrl(this.state.selectedCity, this.state.selectedNeighborhood)) ? 
                    <TileLayer
                      key='AD'
                      url={ AreaDescriptionsStore.getAdTileUrl(this.state.selectedCity, this.state.selectedNeighborhood) }
                      zIndex={ 1000 }
                      detectRetina={true}
                    />:
                    null
                  }

                {/* JSX Comment 
                  <Legend 
                    items={ [ 'Close' ] }
                    className='adClose' 
                    onItemSelected={ this.onAdImageClicked } 
                  /> */}
                </Map> :
                ''

            }
          {/* JSX Comment 
            <div className='longishForm noAD'>
              <p>An area description is not available for this neighborhood.</p>
            </div> */}

          </React.Fragment>
        }
      {/* JSX Comment 
        { (dimensions.size !== 'mobile') && 
          <Navigation 
            show_menu={ this.state.show_panorama_menu } 
            on_hamburger_click={ this.onPanoramaMenuClick } 
            nav_data={ panoramaNavData.filter((item, i) => item.url.indexOf('holc') === -1) } 
            links={ [
              { name: 'Digital Scholarship Lab', url: '//dsl.richmond.edu' },
              { name: 'University of Richmond', url: '//www.richmond.edu' }
            ] }
            link_separator=', '
          />
        } */}

        { (false) && 
          <div className='row full-height'>
            <div className='columns eight full-height'>


                { TextsStore.mainModalIsOpen() && TextsStore.getSubject() !== 'burgess' ?
                  <div className='longishform'>
                    <button className='close' onClick={ this.onModalClick }><span>×</span></button>
                    <div className='content' dangerouslySetInnerHTML={ TextsStore.getModalContent() } />
                  </div> :
                  null
                }

                { TextsStore.mainModalIsOpen() && TextsStore.getSubject() == 'burgess' ?
                  <div className='longishform'>
                    <Burgess 
                      onCitySelected={ this.onCitySelected } 
                      onModalClick={ this.onModalClick }
                    />
                  </div> :
                  null
                }

                { (this.state.contactUs) ?
                  <ContactUs onContactUsToggle={ this.onContactUsToggle }/> :
                  ''
                }

                { UserLocationStore.getOfferZoomTo() ?
                  
                  <div className='arealocation'>
                    <div className='arealocationPrompt'>
                      <p>Would you like to zoom to { UserLocationStore.getCity() }?</p>
                      <button className='sure' onClick={ this.onUserCityResponse } value={ 'yes' }>Sure</button>
                      <button className='nope' onClick={ this.onUserCityResponse } value={ 'no' }>No thanks</button>
                    </div>
                  </div> :
                  null
                }

            </div>


            <div 
              className='columns four full-height'
              id='sidebar'
              style={{ 
                height: (dimensions.size === 'mobile') ? dimensions.mobileSidebarHeight : 'auto'
              }}
            >





              { (dimensions.size === 'mobile') &&
                <svg
                  width={dimensions.windowWidth}
                  height={16}
                  onMouseDown={this.onMobileHandleDown}
                  onMouseMove={this.onMobileHandleDrag}
                  onMouseUp={this.onMobileHandleUp}
                  onTouchStart={this.onMobileHandleDown}
                  onTouchMove={this.onMobileHandleDrag}
                  onTouchEnd={this.onMobileHandleUp}
                >
                  <rect
                    x={0}
                    y={0}
                    width={dimensions.windowWidth}
                    height={32}
                    fill='white'
                    rx={16}
                    ry={16}
                  />
                  <line
                    x1={dimensions.windowWidth / 2 - 30}
                    x2={dimensions.windowWidth / 2 + 30}
                    y1={6}
                    y2={6}
                    stroke='grey'
                    strokeWidth={4}
                    strokeLinecap='round'
                  />

                </svg>
              }

              <div 
                className='row full-height template-tile dataViewer' 
                style={ DimensionsStore.getSidebarHeightStyle() }
                style={{display: 'none'}}
              >

                { (!this.state.selectedNeighborhood && !this.state.selectedCategory && this.state.selectedCity && this.state.unselectedVisibleCities.length > 0) ?
                  <div>
                    <h4>Other Visible Cities</h4>
                    { Object.keys(this.state.unselectedVisibleCities).map(i => {
                      return (
                        <CitySnippet 
                          cityData={ this.state.unselectedVisibleCities[i] } 
                          onCityClick={ this.onCitySelected } 
                          key={ 'city' + this.state.unselectedVisibleCities[i].ad_id } 
                        /> 
                      );
                    })} 
                  </div> :
                  ''
                }

                { (false && this.state.selectedNeighborhood && this.state.adImageOpen) ? 
                  <SidebarMap
                    ref='sidebar_map'
                    state={ this.state }
                    selectedCity = { this.state.selectedCity }
                    onMapMoved={ this.onMapMoved }
                    onNeighborhoodPolygonClick={ this.onNeighborhoodPolygonClick }
                    onCityMarkerSelected= { this.onCityMarkerSelected }
                    areaId={ this.state.selectedNeighborhood } 
                    previousAreaId={ AreaDescriptionsStore.getPreviousHOLCId(this.state.selectedCity, this.state.selectedNeighborhood) }
                    nextAreaId={ AreaDescriptionsStore.getNextHOLCId(this.state.selectedCity, this.state.selectedNeighborhood) }
                    neighborhoodNames={ AreaDescriptionsStore.getNeighborhoodNames(this.state.selectedCity) }
                    onHOLCIDClick={ this.onHOLCIDClick } 
                    onSliderChange={ this.onSliderChange }
                    onClose={ this.onNeighborhoodClose }
                    previousStyle={ DimensionsStore.getADNavPreviousStyle() }
                    nextStyle={ DimensionsStore.getADNavNextStyle() }
                    mapStyle={ DimensionsStore.getSidebarMapStyle() }
                  /> : 
                  ''
                }

                { (this.state.selectedCategory) &&
                  <ADCat 
                    ADsByCat={ AreaDescriptionsStore.getADsForCategory(this.state.selectedCity, this.state.selectedCategory) }
                    neighborhoodNames={ AreaDescriptionsStore.getNeighborhoodNames(this.state.selectedCity) }
                    formId = { AreaDescriptionsStore.getFormId(this.state.selectedCity) }
                    title={ AreaDescriptionsStore.getCatTitle(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                    catNum={ this.getCatNum() } 
                    catLetter = { this.getCatLetter() } 
                    previousCatIds = { AreaDescriptionsStore.getPreviousCatIds(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                    nextCatIds = { AreaDescriptionsStore.getNextCatIds(this.state.selectedCity, this.getCatNum(), this.getCatLetter()) }
                    cityId={ this.state.selectedCity }
                    onNeighborhoodClick={ this.onHOLCIDClick } 
                    onCategoryClick={ this.onCategoryClick } 
                    onNeighborhoodHover={ this.onNeighborhoodHighlighted } 
                    onNeighborhoodOut={ this.onNeighborhoodUnhighlighted } 
                    previousStyle={ DimensionsStore.getADNavPreviousStyle() }
                    nextStyle={ DimensionsStore.getADNavNextStyle() }
                    onClose={ this.onCategoryClose }
                  />
                }

                { (!this.state.selectedCity && !this.state.selectedNeighborhood && !this.state.selectedCategory) ?
                  MapStateStore.getVisibleStateAbbrs().map((abbr) => {
                    return <StateList 
                      stateName={ stateAbbrs[abbr] } 
                      stateAbbr={ abbr }
                      cities={ MapStateStore.getVisibleCitiesForState(abbr) } 
                      onCityClick={ this.onCitySelected }
                      onStateClick={ this.onStateSelected }
                      key={ abbr }
                    />;
                  }) :
                  ''
                }

              </div>
            </div>
          </div>
        }

        { this.state.showIntroModal ? <IntroModal onDismiss={ this.onDismissIntroModal } /> : '' }
      </div> 
    );

  }
}

App.defaultProps = {
  initialHashState: HashManager.getState()
};
