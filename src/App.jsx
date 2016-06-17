import * as React from 'react';
import { render } from 'react-dom';
//import "babel-polyfill";
import Modal from 'react-modal';
import {Typeahead} from 'react-typeahead';
import { Map, TileLayer, GeoJson, Circle, Rectangle } from 'react-leaflet';
import leafletsnogylop from 'leaflet.snogylop';
import { CartoDBTileLayer, HashManager, Legend, IntroManager, Navigation } from '@panorama/toolkit';

// stores
import CityStore from './stores/CityStore';
import RasterStore from './stores/RasterStore';

// components (views)
import CityStats from './components/CityStats.jsx';
import CitySnippet from './components/CitySnippet.jsx';
import TypeAheadCitySnippet from './components/TypeAheadCitySnippet.jsx';
import StateStats from './components/StateStats.jsx';
import AreaDescription from './components/AreaDescription.jsx';
import ADCat from './components/ADCat.jsx';
import Downloader from './components/Downloader.jsx';
import Donut from './components/Donut/Donut.jsx';
import AreaPolygon from './components/AreaPolygon.jsx';

// utils
import { AppActions, AppActionTypes } from './utils/AppActionCreator';

// config
import appConfig from '../data/appConfig.json';
import tileLayers from '../basemaps/tileLayers.json';
import cartodbConfig from '../basemaps/cartodb/config.json';
import cartodbLayers from '../basemaps/cartodb/basemaps.json';

// data
import panoramaNavData from '../data/panorama_nav.json';
import stateAbbrs from '../data/state_abbr.json';

// main app container
export default class App extends React.Component {

	constructor (props) {
		super(props);

		this.state = this.getDefaultState();

		// bind handlers
		let handlers = ['onWindowResize','hashChanged','openModal','closeModal','toggleBurgessDiagram','initialDataLoaded','storeChanged','ringAreaSelected','ringAreaUnselected','gradeSelected','gradeUnselected','onStateSelected','onCitySelected','onNeighborhoodClick','onSelectedNeighborhoodClick','triggerIntro','onIntroExit','onMapMoved','onPanoramaMenuClick','onDownloadClicked','onCategoryClick','neighborhoodHighlighted','neighborhoodsUnhighlighted','onSearchChange'];
		handlers.map(handler => { this[handler] = this[handler].bind(this); });
	}

	componentWillMount () {
		this.computeComponentDimensions();
		AppActions.loadInitialData(this.state);
	}

	componentDidMount () {
		window.addEventListener('resize', this.onWindowResize);	
		RasterStore.addListener(AppActionTypes.initialDataLoaded, this.initialDataLoaded);
		CityStore.addListener(AppActionTypes.initialDataLoaded, this.initialDataLoaded);	
		RasterStore.addListener(AppActionTypes.storeChanged, this.storeChanged);
		CityStore.addListener(AppActionTypes.storeChanged, this.storeChanged);

		// Prepare object to deliver default application state to HashManager,
		// with initial values paired with keys to use in the hash.
		let initialState = {};
		initialState.city = this.state.selectedCity;
		initialState[HashManager.MAP_STATE_KEY] = HashManager.getState(HashManager.MAP_STATE_KEY);
		HashManager.updateHash(initialState);
	}

	componentWillUnmount () { }

	componentDidUpdate () {
		//this.refs.the_map.leafletElement.options.maxZoom = (this.state.selectedCity && RasterStore.hasLoaded()) ? RasterStore.getSelectedCityMetadata('maxZoom') : null;
	}

	getDefaultState () {
		let hashState = HashManager.getState();

		return {
			selectedNeighborhood: (hashState.area) ? hashState.area : null,
			selectedCity: (hashState.city) ? parseInt(hashState.city) : (hashState.state) ? null : 168, // Richmond
			selectedCategory: (hashState.category) ? hashState.category : null,
			selectedRingGrade: { 
				ring: null, 
				grade: null
			},
			selectedGrade: null,
			highlightedNeighborhood: null,
			burgessDiagramVisible: false,
			intro: {
				open: false
			},
			modalSectionOpen: null,
			downloadOpen: false,
			map: {
				zoom: 12,
				center: [30, 90]
			},
			dimensions: {
				left: {
					width: 0,
					height: 0
				},
				upperRight: {
					width: 0,
					height: 0
				}
			}
		};
	}

	initialDataLoaded () {
		this.setState({
			selectedCity: RasterStore.getSelectedCityMetadata('id'),
			map: {
				center: this.getLoc(),
				zoom: this.getZoom()
			}
		});
	}

	storeChanged (options) {
		let newState = {

			selectedCity: RasterStore.getSelectedCityMetadata('id'),
			selectedNeighborhood: null,
			selectedCategory: null,
			selectedRingGrade: {
				ring: null,
				grade: null
			},
			highlightedNeighborhood: null
		};
		// only change the map location if that's requested or it's not already visible
		let mapBounds = this.refs.the_map.leafletElement.getBounds();
		if ((options && options.zoomToCity) || !mapBounds.intersects(RasterStore.getMapBounds())) {
			let center = (CityStore.getPolygonsCenter()) ? CityStore.getPolygonsCenter() : RasterStore.getCenter(),
				bounds = (CityStore.getPolygonsBounds()) ? CityStore.getPolygonsBounds() : RasterStore.getMapBounds(),
				zoom = this.refs.the_map.leafletElement.getBoundsZoom(bounds);
			newState.map = {
				center: center,
				zoom: zoom
			}
		}
		this.setState(newState, this.changeHash);
	}

	ringAreaSelected (ringNum, grade) {
		this.setState({
			selectedRingGrade: { 
				ring: ringNum, 
				grade: grade
			} 
		});
	}

	ringAreaUnselected () {
		this.setState({
			selectedRingGrade: { 
				ring: null, 
				grade: null
			} 
		});
	}

	gradeSelected (grade) {
		this.setState({
			selectedGrade: grade
		});
	}

	gradeUnselected (grade) {
		this.setState({
			selectedGrade: null
		});
	}

	neighborhoodSelected (id) {
		this.setState({
			selectedNeighborhood: id,
			selectedCategory: null,
			highlightedNeighborhood: null
		}, this.changeHash);
	}

	neighborhoodHighlighted (event) {
		this.setState({
			highlightedNeighborhood: event.target.id
		});
	}

	neighborhoodsUnhighlighted (event) {
		this.setState({
			highlightedNeighborhood: null
		});
	}

	categorySelected (id) {
		this.setState({
			selectedNeighborhood: null,
			selectedCategory: id
		}, this.changeHash);
	}

	onWindowResize (event) {
		this.computeComponentDimensions();
	}

	onCitySelected (value, index) {
		// for click on state name in sidebar
		value = (value.target) ? (value.target.options) ? value.target.options : value.target : value;
		value.zoomTo = (typeof(value.zoomTo) == 'undefined') ? true : value.zoomTo;

		this.setState({
			selectedNeighborhood: null
		});

		if (value && value.id) {
			AppActions.citySelected(value.id, {zoomTo: value.zoomTo});
		}
	}

	onStateSelected (value, index) {
		// for click on state name in sidebar
		value = (value.target) ? value.target : value;
				
		this.setState({
			selectedCity: null,
			selectedNeighborhood: null,
			map: {
				zoom: this.refs.the_map.leafletElement.getBoundsZoom(RasterStore.getMapBoundsForState(value.id)),
				center: RasterStore.getCenterForState(value.id)
			}
		}, this.changeHash());
	}

	onSearchChange (result, event) {
		console.log(result.target, event.target);
		//event.preventDefault();
		//event.stopPropagation();
		this.onCitySelected({id: result.cityId, zoomTo: true});
	}

	onNeighborhoodClick (event) {
		let neighborhoodId = (event.target.options) ? event.target.options.neighborhoodId : event.target.id;
		this.neighborhoodSelected((neighborhoodId !== this.state.selectedNeighborhood) ? neighborhoodId : null);
	}

	onSelectedNeighborhoodClick () {
		this.neighborhoodSelected(null);
	}

	onCategoryClick (event) {
		this.categorySelected(event.target.id);
	}

	onIntroExit () {
		this.setState({
			intro: {
				open: false
			},
			burgessDiagramVisible: false
		});
	}

	onPanoramaMenuClick () {
		this.setState({
			show_panorama_menu: !this.state.show_panorama_menu
		});
	}

	onMapMoved (event) {
		/* if (event && event.target) {
			AppActions.mapMoved({
				zoom: event.target.getZoom(),
				center: event.target.getCenter()
			});
		} */

		let newState = {};
		newState[HashManager.MAP_STATE_KEY] = {
			zoom: event.target.getZoom(),
			center: event.target.getCenter()
		};

		
		let mapBounds = event.target.getBounds(),
			visibleMaps = this.getVisibleMaps(event.target.getBounds()),
			visibleMapsIds = Object.keys(visibleMaps);

		// select city if it's the only one visible
		if (visibleMapsIds.length == 1 && parseInt(visibleMapsIds[0]) !== this.state.selectedCity) {
			let cityId = parseInt(visibleMapsIds[0]);
			newState.city = cityId;
			AppActions.citySelected(cityId);
		}
		// deselect city if the zoom is 9 or below or if the map doesn't overlap
		else if ((event.target.getZoom() <= 9 && visibleMapsIds.length > 1) || !mapBounds.intersects(RasterStore.getMapBounds())) {
			this.setState({
				selectedCity: null
			});
			newState.city = null;
		}



		HashManager.updateHash(newState);
	}

	getVisibleMaps(viewBounds) {
		let rasters = RasterStore.getAllRasters(),
			visibleMaps = {};

		Object.keys(rasters).forEach((id) => {
			if (viewBounds.intersects(rasters[id].bounds)) {
				visibleMaps[id] = rasters[id];
			}
		});

		return visibleMaps;
	}

	getVisibleMapsByState() {
		if (!this.refs.the_map) {
			return {}
		}

		let visibleMaps = this.getVisibleMaps(this.refs.the_map.leafletElement.getBounds()),
			maps = {};

		Object.keys(visibleMaps).forEach((id) => {
			maps[visibleMaps[id].state] =  (maps[visibleMaps[id].state]) ? maps[visibleMaps[id].state] : [];
			maps[visibleMaps[id].state].push(visibleMaps[id]);
		});

		// alphabetize
		Object.keys(maps).forEach((the_state) => {
			maps[the_state].sort((a,b) => a.city > b.city);
		});

		return maps;
	}

	onDownloadClicked () {
		this.setState({
			downloadOpen: !this.state.downloadOpen
		});
	}

	// fit to window if necessary
	makeRingVisable () {

	}

	changeHash () {
		let newState = { 
			city: this.state.selectedCity,
			area: this.state.selectedNeighborhood,
			category: this.state.selectedCategory
		};
		newState[HashManager.MAP_STATE_KEY] = {
			zoom: this.state.map.zoom,
			center: this.state.map.center
		};

		HashManager.updateHash(newState);
	}

	hashChanged (event, suppressRender) {
		this.setState({
			mapState: HashManager.getState(HashManager.MAP_STATE_KEY)
		});
	}

	computeComponentDimensions () {
		// based off of sizes stored within _variables.scss --
		// if you change them there, change them here.
		var containerPadding = 20,
			headerHeight = 100,
			bottomRowHeight = 300,
			dimensions = {};

		dimensions.search = {
			width: window.innerWidth / 3 - 2 * containerPadding,
			height: window.innerHeight - 2 * containerPadding
		};

		dimensions.bottom = {
			height: window.innerHeight - headerHeight - 2 * containerPadding
		};

		this.setState({ dimensions: dimensions });
	}

	openModal (event) {
		let section = event.target.id;
		console.log(event.target, section);
		this.setState({ modalSectionOpen: section });
	}

	closeModal() {
		this.setState({ modalSectionOpen: null});
	}

	toggleBurgessDiagram () {
		this.setState({
			burgessDiagramVisible: !this.state.burgessDiagramVisible
		});
	}

	triggerIntro (event) {
		if (this.state.modalSectionOpen) {
			this.closeModal();
		}

		// toggle off if the selected intro box is clicked
		if (this.state.intro.open && event && event.currentTarget && this.state.intro.step == parseInt(event.currentTarget.dataset.step)) {
			this.setState({intro: {open: false}});
			return;
		}

		this.setState({
			intro: {
				open: true,
				step: (event && event.currentTarget) ? parseInt(event.currentTarget.dataset.step) : null,
				config: {
					showStepNumbers: false,
					skipLabel: '×',
					nextLabel: '⟩',
					prevLabel: '⟨',
					doneLabel: '×'
				},
				steps: appConfig.introSteps,
				onExit: this.onIntroExit
			}
		});
	}

	getLoc () {
		let hashState = HashManager.getState();

		if (hashState.loc && hashState.loc.center) {
			return [ hashState.loc.center[0], hashState.loc.center[1] ];
		} else if (this.state.selectedCity) {
			return RasterStore.getCenter();
		} else {
			return [30,-90];
		}
	}

	getZoom() {
		let hashState = HashManager.getState();
		if (hashState.loc && hashState.loc.zoom) {
			return hashState.loc.zoom;
		} else if (this.state.selectedCity) {
			return this.refs.the_map.leafletElement.getBoundsZoom(RasterStore.getMapBounds());
		} else {
			return 12;
		}
	}

	searchDisplay () {
		let citiesOptions = RasterStore.getCityIdsAndNames(),
			citiesData = RasterStore.getAllRasters();
		return citiesOptions.map((cityOption) => {
			return {
				id: cityOption.id,
				cityName: cityOption.cityName,
				display: <CitySnippet 
					cityData={ citiesData[cityOption.id] } 
					onCityClick={ this.props.onCityClick } 
					key={ 'citySearch' + cityOption.id } 
				/>
			}
		});
	}

	parseModalCopy (subject) {
		let modalCopy = '';

		if (subject) {
			try {
				modalCopy = appConfig.modalContent[subject].join('\n');
			} catch (error) {
				console.warn('Error parsing modal copy: ', subject);
				modalCopy = 'Error parsing modal copy.';
			}
		}

		// React requires this format to render a string as HTML,
		// via dangerouslySetInnerHTML.
		return {
			__html: modalCopy
		};
	}

	renderSidebar() {
		let title, content, theClass;
		let ADs = CityStore.getAreaDescriptions();

		if (this.state.downloadOpen) {
			title = 	<h2>
							{ (typeof(RasterStore.getSelectedCityMetadata()) != 'undefined') ? RasterStore.getSelectedCityMetadata().name : '' }
							<div className='downloadicon' href='#' onClick={ this.onDownloadClicked }></div>
						</h2>;
			content = <Downloader mapurl={ RasterStore.getMapUrl() } name={ RasterStore.getSelectedCityMetadata().name } />;
		} else if (this.state.selectedNeighborhood) {
			theClass = 'area';
			title = 	<h2>
							<span>{ RasterStore.getSelectedCityMetadata().name + ', '}</span> 
							<span onClick={ this.onStateSelected } id={ RasterStore.getSelectedCityMetadata().state }>{ RasterStore.getSelectedCityMetadata().state }</span>
							<div className='downloadicon' href='#' onClick={ this.onDownloadClicked }></div>
						</h2>;
			content = 	<AreaDescription 
							areaId={ this.state.selectedNeighborhood } 
							areaData={ ADs[this.state.selectedNeighborhood] } 
							formId={ CityStore.getFormId() } 
							onCategoryClick={ this.onCategoryClick } 
							onNeighborhoodClick={ this.onNeighborhoodClick } 
							ref={'areadescription' + this.state.selectedNeighborhood } 
						/>;
		} else if (this.state.selectedCategory && CityStore.getADsByCat(...this.state.selectedCategory.split('-'))) {
			let [catNum, catLetter] = this.state.selectedCategory.split('-');
			theClass = 'category';
			title = 	<h2>
							<span>{ RasterStore.getSelectedCityMetadata().name + ', '}</span> 
							<span onClick={ this.onStateSelected } id={ RasterStore.getSelectedCityMetadata().state }>{ RasterStore.getSelectedCityMetadata().state }</span>
							<div className='downloadicon' href='#' onClick={ this.onDownloadClicked }></div>
						</h2>;
			content = 	<ADCat 
							catNum={ catNum } 
							catLetter = { catLetter } 
							onNeighborhoodClick={ this.onNeighborhoodClick } 
							onCategoryClick={ this.onCategoryClick } 
							onNeighborhoodHover={ this.neighborhoodHighlighted } 
							onNeighborhoodOut={ this.neighborhoodsUnhighlighted } 
						/>;
		} else if (this.state.selectedCity) {
			theClass = 'city';
			title = 	<h2>
							<span>{ RasterStore.getSelectedCityMetadata().name + ', '}</span> 
							<span onClick={ this.onStateSelected } id={ RasterStore.getSelectedCityMetadata().state }>{ RasterStore.getSelectedCityMetadata().state }</span>
							<div className='downloadicon' href='#' onClick={ this.onDownloadClicked }></div>
						</h2>;
			content = 	<CityStats 
							cityData={ CityStore.getCityData() } 
							area={ CityStore.getArea() } 
							gradeStats={ CityStore.getGradeStats() } 
							ringStats={ CityStore.getRingStats() } 
							areaSelected={ this.ringAreaSelected } 
							areaUnselected={ this.ringAreaUnselected } 
							gradeSelected={ this.gradeSelected } 
							gradeUnselected={ this.gradeUnselected } 
							triggerIntro={ this.triggerIntro } 
							burgessDiagramVisible={ this.state.burgessDiagramVisible } 
							toggleBurgessDiagram={ this.toggleBurgessDiagram } 
						/>;
		} else if (!this.state.selectedCity) {
			theClass = 'state';
			let visibleStates = this.getVisibleMapsByState();
			content = 	Object.keys(visibleStates).map((theState) => {
				return <StateStats 
					stateName={ stateAbbrs[theState] } 
					cities={ visibleStates[theState] } 
					onCityClick={ this.onCitySelected }  
					key={ theState }
				/>;
			});
		}


		return (
			<div className={ theClass } key={ theClass }>
				{ title }
				{ content }
			</div>
		);
	}

	render () {
				
		let modalStyle = {
				overlay : {
					backgroundColor: null
				},
				content : {
					top: null,
					left: null,
					right: null,
					bottom: null,
					border: null,
					background: null,
					borderRadius: null,
					padding: null,
					position: null
				}
			},
			mapConfig = this.state.map || this.state.mapConfig,
			ADs = CityStore.getAreaDescriptions(),
			outerRadius = CityStore.getOuterRingRadius();

		console.log(CityStore.getFormId());

		return (
			<div className='container full-height'>
				<Navigation 
					show_menu={ this.state.show_panorama_menu } 
					on_hamburger_click={ this.onPanoramaMenuClick } 
					nav_data={ panoramaNavData.filter((item, i) => item.url.indexOf('holc') === -1) } 
				/>
				<div className='row full-height'>
					<div className='columns eight full-height'>
						<header className='row u-full-width'>
							<h1>
								<span className='header-main'>Mapping Inequality</span>
								<span className='header-sub'>Redlining in New Deal America</span>
							</h1>
							<h4 onClick={ this.openModal } id={ 'about' }>Introduction</h4>
							<h4 onClick={ this.openModal } id={ 'bibliograph' }>Bibliographic Notes & Bibliography</h4>
							<h4 onClick={ this.openModal } id={ 'credits' }>Credits</h4>
							<hr className='style-eight'>
							</hr>
							<button className='intro-button' data-step='1' onClick={ this.triggerIntro }>
								<span className='icon info'/>
							</button>
						</header>
						<div className='row template-tile leaflet-container' style={{height: this.state.dimensions.bottom.height + 'px'}}>
							<Map 
								ref='the_map' 
								center={ this.state.map.center } 
								zoom={ this.state.map.zoom }  
								onLeafletMoveend={ this.onMapMoved } 
							>
								{ tileLayers.layers.map((item, i) => {
									return (
										<TileLayer
											key={ 'basetiles' + i }
											url={ item.url }
										/>
									);
								}) } 

								{ RasterStore.getMapsList().map((item, i) => {
									return (
										<TileLayer
											key={ 'holctiles' + i }
											url={ item.url }
											minZoom={ item.minZoom }
											bounds= { [[item.minLat,item.minLng],[item.maxLat,item.maxLng]]}
										/>
									);
								}) }

								{ cartodbLayers.layergroup.layers.map((item, i) => {
									return (
										<CartoDBTileLayer
											key={ 'cartodb-tile-layer-' + i }
											userId={ cartodbConfig.userId }
											sql={ item.options.sql }
											cartocss={ item.options.cartocss }
											zIndex={1000}
										/>
									);
								}) }

								{ (outerRadius > 0) ?
									<Circle 
										center={ CityStore.getLoopLatLng() } 
										radius={ outerRadius / 7 } 
										fillOpacity={ (this.state.selectedRingGrade.ring >= 2) ? 0.75 : 0 } 
										fillColor= { '#000' } 
										clickable={ false } 
										className={ 'donuthole' } 
										key={ 'donuthole' } 
									/> :
									null
								}
							
								{ (outerRadius > 0) ?
									[2,3,4,5].map((ringNum) => {
										return (
											<Donut 
												center={ CityStore.getLoopLatLng() } 
												innerRadius={ (ringNum * 2 - 3) / 7 * outerRadius }
												outerRadius={ (ringNum == 5) ? outerRadius * 100 : (ringNum * 2 - 1) / 7 * outerRadius}
												clickable={ false } 
												fillOpacity={ (this.state.selectedRingGrade.ring > 0 && ringNum !== this.state.selectedRingGrade.ring) ? 0.75 : 0 } 
												fillColor= { '#000' } 
												weight={ 1 }
												className={ 'donut' } 
												key={ 'donut' + String(ringNum) } 
											/>
										);
									}) :
									null
								}

								{ (this.state.selectedRingGrade.ring > 0) ?
									<GeoJson 
										data={ CityStore.getGeoJsonForSelectedRingArea(this.state.selectedRingGrade.ring, this.state.selectedRingGrade.grade) }
										clickable={ false }
										key={ 'ringStroke'} 
										fillColor={ '#000'}
										fillOpacity={0.65}
										weight={ 2 }
										opacity={ 0.9 }
										className={ 'gradeStroke grade' + this.state.selectedRingGrade.grade}
									/> :
									null
								}

								{ (this.state.selectedGrade) ?
									<AreaPolygon 
										data={ CityStore.getGeoJsonForGrade(this.state.selectedGrade) }
										key={ 'selectedGradedNeighborhoods' } 
										className={ 'selectedGradedNeighborhoods grade' + this.state.selectedGrade } 
									/> :
									null
								}

								{ (this.state.selectedNeighborhood && ADs[this.state.selectedNeighborhood] && ADs[this.state.selectedNeighborhood].area_geojson_inverted) ?
									<AreaPolygon
										data={ ADs[this.state.selectedNeighborhood].area_geojson_inverted } 
										clickable={ false }
										className={ 'neighborhoodPolygonInverted grade' + ADs[this.state.selectedNeighborhood].holc_grade } 
										key={ 'neighborhoodPolygonInverted' + this.state.selectedNeighborhood }
									/> :
									null
								}

								{ (CityStore.hasADData()) ?
									Object.keys(ADs).map((id) => {
										return (
											<AreaPolygon
												data={ ADs[id].area_geojson }
												className={ 'neighborhoodPolygon grade' + ADs[id].holc_grade }
												key={ 'neighborhoodPolygon' + id } 
												onClick={ this.onNeighborhoodClick }
												neighborhoodId={ id } 
											/>
										);
									}) :
									null
								}

								{ (this.state.selectedCity == null && this.state.map.zoom <= 11) ?
									RasterStore.getMapsList().map((item, i) => {
										return ((item.radii) ?
											Object.keys(item.radii).map((grade) => {
												return (item.radii[grade].inner == 0) ?
													<Circle
														center={ [item.centerLat, item.centerLng] }
														radius={ item.radii[grade].outer }
														id={ item.cityId }
														onClick={ this.onCitySelected }
														key={ 'clickableDonut' + item.cityId + grade }
														className={ 'simpleDonut grade_' + grade }
													/> :
													<Donut
														center={ [item.centerLat, item.centerLng] }
														innerRadius={ item.radii[grade].inner }
														outerRadius={ item.radii[grade].outer }
														id={ item.cityId }
														onClick={ this.onCitySelected }
														key={ 'clickableDonut' + item.cityId + grade }
														className={ 'simpleDonut grade_' + grade }
													/>
											}) :
											<Circle
												center={ [item.centerLat, item.centerLng] }
												radius={ 25000 }
												id={ item.cityId }
												onClick={ this.onCitySelected }
												key={ 'clickableMap' + item.cityId }
												className={ 'cityCircle '}
											/> 
										);
									}) :
									null
								}

							</Map>
						</div>
					</div>
					<div className='columns four full-height'>
						<div className='row template-tile city-selector' style={{height: this.state.dimensions.search.height + 'px', width: this.state.dimensions.search.width + 'px'}}>
							<Typeahead
								options={ RasterStore.getMapsList() }
								placeholder={ 'Search by city or state' }
								filterOption={ 'searchName' }
								displayOption={(city, i) => city.cityId }
								onOptionSelected={ this.onCitySelected }
								customListComponent={ TypeAheadCitySnippet }
								maxVisible={ 8 }
							/>
						</div>
						<div className='row full-height template-tile dataViewer' style={{height: this.state.dimensions.bottom.height + 'px'}}>
							{ this.renderSidebar() }
						</div>
					</div>
					<Modal 
						isOpen={ this.state.modalSectionOpen !== null } 
						onRequestClose={ this.closeModal} 
						style={ modalStyle }
					>
						<button className='close' onClick={ this.closeModal }><span>×</span></button>
						<div dangerouslySetInnerHTML={ this.parseModalCopy(this.state.modalSectionOpen) }></div>
					</Modal>

					<IntroManager { ...this.state.intro } />
				</div>
			</div> 
		);

	}
}