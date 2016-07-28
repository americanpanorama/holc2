import * as React from 'react';
import { PropTypes } from 'react';


// stores
import AreaDescriptionsStore from '../stores/AreaDescriptionsStore';
import CityStore from '../stores/CityStore';
import MapStateStore from '../stores/MapStateStore';
import RasterStore from '../stores/RasterStore';
import UserLocationStore from '../stores/UserLocationStore';

// components
import { Map, TileLayer, GeoJson, Circle, LayerGroup, Marker, setIconDefaultImagePath } from 'react-leaflet';
import { CartoDBTileLayer, Legend } from '@panorama/toolkit';
import AreaPolygon from './AreaPolygon.jsx';
import Donut from './Donut/Donut.jsx';


import cartodbConfig from '../../basemaps/cartodb/config.json';
import cartodbLayers from '../../basemaps/cartodb/basemaps.json';
import tileLayers from '../../basemaps/tileLayers.json';

export default class HOLCMap extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {

	}

	componentDidUpdate(prevProps) {

	}

	render () {

		let ADs = AreaDescriptionsStore.getVisible(),
			aboveThreshold = MapStateStore.isAboveZoomThreshold(),
			outerRadius = CityStore.getOuterRingRadius();

		const selectedADs = AreaDescriptionsStore.getADsForNeighborhood(this.props.state.selectedCity, this.props.state.selectedNeighborhood),
			neighborhoodNames = AreaDescriptionsStore.getNeighborhoodNames(this.props.state.selectedCity),
			ADsByCat = AreaDescriptionsStore.getADsForCategory(this.props.state.selectedCity, this.props.state.selectedCategory),
			catNum = (this.props.state.selectedCategory) ? this.props.state.selectedCategory.split('-')[0] : null,
			catLetter = (this.props.state.selectedCategory) ? this.props.state.selectedCategory.split('-')[1] : null,
			visibleMaps = MapStateStore.getVisibleHOLCMaps(),
			visibleMapsList = MapStateStore.getVisibleHOLCMapsList(),
			visibleStates = MapStateStore.getVisibleHOLCMapsByState();

		let legendData = {
			items: [
				'A First Grade',
				'B Second Grade',
				'C Third Grade',
				'D Fourth Grade',
			]
		};

		console.log(visibleMapsList);

		return (

			<Map 
				ref='the_map' 
				center={ this.props.state.map.center } 
				zoom={ this.props.state.map.zoom }  
				onMoveend={ this.props.onMapMoved } 
				className='the_map'
			>

				{ tileLayers.layers.map((item, i) => {
					return (this.props.state.map.zoom < 10 ) ?
						<TileLayer
							key='noLabels'
							url={ item.urlNoLabels }
							zIndex={ -1 }
						/> : 
						<TileLayer
							key='labels'
							url={ item.urlLabels }
							zIndex={ -1 }
						/>
				}) } 

				{ visibleMapsList.map((item, i) => {
					console.log(item.city);
					return (
						<TileLayer
							key={ 'holctiles' + item.id}
							className={ 'tilesForCity' + item.cityId + item.id }
							url={ item.url }
							minZoom={ item.minZoom }
							bounds= { item.bounds }
							opacity={ this.props.state.raster.opacity }
							zIndex={ (item.cityId == this.props.state.selectedCity) ? 1 : null }
						/>
					);
				}) }

				{ (!aboveThreshold) ?
					cartodbLayers.layergroup.layers.map((item, i) => {
						return (
							<CartoDBTileLayer
								key={ 'cartodb-tile-layer-' + i }
								userId={ cartodbConfig.userId }
								sql={ item.options.sql }
								cartocss={ item.options.cartocss }
								zIndex={1000}
							/>
						);
					}) :
					null
				}

				{/* rings: donut holes */}
				{ (aboveThreshold && outerRadius > 0) ?
					<Circle 
						center={ CityStore.getLoopLatLng() } 
						radius={ outerRadius / 7 } 
						fillOpacity={ (this.props.state.selectedRingGrade.ringId >= 2) ? 0.75 : 0 } 
						fillColor= { '#000' } 
						clickable={ false } 
						className={ 'donuthole' } 
						key={ 'donuthole' } 
					/> :
					null
				}
			
				{/* rings: donuts */}
				{ (aboveThreshold && outerRadius > 0) ?
					[2,3,4,5].map((ringNum) => {
						return (
							<Donut 
								center={ CityStore.getLoopLatLng() } 
								innerRadius={ (ringNum * 2 - 3) / 7 * outerRadius }
								outerRadius={ (ringNum == 5) ? outerRadius * 100 : (ringNum * 2 - 1) / 7 * outerRadius}
								clickable={ false } 
								fillOpacity={ (this.props.state.selectedRingGrade.ringId > 0 && ringNum !== this.props.state.selectedRingGrade.ringId) ? 0.75 : 0 } 
								fillColor= { '#000' } 
								weight={ 1 }
								className={ 'donut' } 
								key={ 'donut' + String(ringNum) } 
							/>
						);
					}) :
					null
				}

				{/* rings: selected ring */}
				{ (aboveThreshold && this.props.state.selectedRingGrade.ringId > 0) ?
					<LayerGroup>
						<GeoJson 
							data={ CityStore.getInvertedGeoJsonForSelectedRingArea(this.props.state.selectedRingGrade.ringId, this.props.state.selectedRingGrade.grade) }
							clickable={ false }
							key={ 'invertedRingStroke'} 
							fillColor={ '#000'}
							fillOpacity={ 0.6 }
							color={ '#fff' }
							weight={ 2 }
							opacity={ 0.9 }
							className={ 'invertedRingGradedArea' }
						/>
						<GeoJson 
							data={ CityStore.getGeoJsonForSelectedRingArea(this.props.state.selectedRingGrade.ringId, this.props.state.selectedRingGrade.grade) }
							clickable={ false }
							key={ 'ringStroke'} 
							fillOpacity={ (1 - this.props.state.raster.opacity) / 2 }
							weight={ 2 }
							opacity={ 0.9 }
							className={ 'ringGradedArea grade' + this.props.state.selectedRingGrade.grade}
						/>
					</LayerGroup> :
					null
				}

				{/* selected grade */}
				{ (aboveThreshold && this.props.state.selectedGrade) ?
					<AreaPolygon 
						data={ AreaDescriptionsStore.getGeoJsonForGrade(this.props.state.selectedCity, this.props.state.selectedGrade) }
						key={ 'selectedGradedNeighborhoods' } 
						className={ 'selectedGradedNeighborhoods grade' + this.props.state.selectedGrade } 
					/> :
					null
				}

				{ (aboveThreshold && this.props.state.highlightedNeighborhood && ADs[this.props.state.selectedCity] && ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood] && ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].area_geojson_inverted) ?
					<AreaPolygon
						data={ ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].area_geojson_inverted } 
						clickable={ false }
						className={ 'neighborhoodPolygonInverted grade' + ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].holc_grade } 
						key={ 'neighborhoodPolygonInverted' + this.props.state.highlightedNeighborhood }
					/> :
					null
				}

				{/* selected neighborhood */}
				{ (aboveThreshold && this.props.state.selectedNeighborhood && ADs[this.props.state.selectedCity] && ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood] && ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood].area_geojson_inverted) ?
					<AreaPolygon
						data={ ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood].area_geojson_inverted } 
						clickable={ false }
						className={ 'neighborhoodPolygonInverted grade' + ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood].holc_grade } 
						key={ 'neighborhoodPolygonInverted' + this.props.state.selectedNeighborhood }
					/> :
					null
				}

				{/* neighborhood polygons: shown on zoom level 10 and higher */}
				{ (aboveThreshold) ?
					Object.keys(ADs).map(adId => {
						return (
							Object.keys(ADs[adId]).map((areaId) => {
								return (
									<AreaPolygon
										data={ ADs[adId][areaId].area_geojson }
										className={ 'neighborhoodPolygon grade' + ADs[adId][areaId].holc_grade }
										key={ 'neighborhoodPolygon' + adId + '-' + areaId } 
										onClick={ this.props.onNeighborhoodPolygonClick }
										adId={ adId }
										neighborhoodId={ areaId } 
										//fillOpacity={ (id == this.props.state.selectedNeighborhood) ? 1 : 0 }
										style={{
											opacity:(this.props.state.selectedRingGrade.ringId > 0) ? (1 - this.props.state.raster.opacity) / 5 : (1 - this.props.state.raster.opacity) / 2,
											fillOpacity: (this.props.state.selectedRingGrade.ringId > 0) ? 0 : (1 - this.props.state.raster.opacity) / 5
										}}
									/>
								);
							})
						)
					}) :
					null
				}

				{/* cartogram marker for city: shown below zoom level 10 */}
				{ (!aboveThreshold) ?
					AreaDescriptionsStore.getADsList().map((item, i) => {
						return ((item.radii && item.centerLat) ?
							Object.keys(item.radii).map((grade) => {
								return (item.radii[grade].inner == 0) ?
									<Circle
										center={ [item.centerLat, item.centerLng] }
										radius={ item.radii[grade].outer }
										id={ item.ad_id }
										onClick={ this.props.onCityMarkerSelected }
										key={ 'clickableDonut' + item.ad_id + grade }
										className={ 'simpleDonut grade_' + grade }
									/> :
									<Donut
										center={ [item.centerLat, item.centerLng] }
										innerRadius={ item.radii[grade].inner }
										outerRadius={ item.radii[grade].outer }
										id={ item.ad_id }
										onClick={ this.props.onCityMarkerSelected }
										key={ 'clickableDonut' + item.ad_id + grade }
										className={ 'simpleDonut grade_' + grade }
									/>
							}) :
							(!item.parent_id  && item.centerLat) ?
								<Circle
									center={ [item.centerLat, item.centerLng] }
									radius={ 25000 }
									id={ item.ad_id }
									onClick={ this.onCityMarkerSelected }
									key={ 'clickableMap' + item.ad_id }
									className={ 'cityCircle '}
								/> :
								null
							
						);
					}) :
					null
				}

				{/* marker for user's location */}
				{ (this.props.state.userLocation) ?
					<Marker position={ this.props.state.userLocation } /> :
					null
				}

				<Legend { ...legendData } onItemSelected={ this.onGradeHover } />

			</Map>
		);
	}
}
