import * as React from 'react';
import PropTypes from 'prop-types';

const MapToggleControl = (props) => {
	const className = `toggle ${(props.opacity === 0) ? 'inactive' : ''}`;
	const label = (props.opacity === 0) ? 'Show HOLC Maps' : 'Hide HOLC Maps';
	return (
		<button 
			className={className}
			style={props.style}
			onClick={props.toggleHOLCMap}
		>
			{label}
		</button>
	);
};

export default MapToggleControl;

MapToggleControl.propTypes = {
	opacity: PropTypes.number.isRequired,
	toggleHOLCMap: PropTypes.func.isRequired,
	style: PropTypes.object.isRequired
};
