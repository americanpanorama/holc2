import React from 'react';
import PropTypes from 'prop-types';

export default class SidebarNeighborhoodNav extends React.Component {

	render() {

		return (
			<div 
				className='adNav' 
				style={ this.props.style }
				onClick={ this.props.onHOLCIDClick } 
				id={ this.props.areaId } 
			>
				{ this.props.areaId }
				{ (this.props.name) ?
					' ' + this.props.name :
					''
				} 
			</div>
		);
	}

}