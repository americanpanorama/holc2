import React from 'react';
import PropTypes from 'prop-types';
import { AppActionTypes } from '../utils/AppActionCreator';
import CitySnippet from './CitySnippet.jsx';


export default class MapList extends React.Component {
	// property validation
	static propTypes = {
		stateName: PropTypes.string,
		onCityClick: PropTypes.func
	};

	constructor () {
		super();
	}

	render () {
		return (
			<div className='stateList'>
				<h2
					onClick={ this.props.onStateClick } 
					id={ this.props.stateAbbr }
				>
					{ this.props.stateName }
				</h2>

				{ this.props.cities.map((cityData) => {
					return <CitySnippet 
						cityData={ cityData } 
						onCityClick={ this.props.onCityClick } 
						key={ 'city' + cityData.ad_id } 
					/>
				}) }
			</div>
		);
	}
}
